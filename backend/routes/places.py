from flask import Blueprint, request, jsonify, g
from database import get_db_connection
from auth import requires_admin, optional_auth
import json

places_bp = Blueprint('places', __name__)

@places_bp.route('/public/places', methods=['GET'])
@places_bp.route('/places', methods=['GET'])
@optional_auth
def get_places():
    city_id = request.args.get('city_id')
    city_name = request.args.get('city_name')
    category_id = request.args.get('category_id')
    category_slug = request.args.get('category_slug')
    search = request.args.get('search', '').strip()
    min_rating = request.args.get('min_rating')
    max_fee = request.args.get('max_fee')
    sort_by = request.args.get('sort_by', 'rating_desc')
    featured = request.args.get('featured')

    query = '''
    SELECT p.*, c.name as city_name, c.state as city_state,
           cat.name as category_name, cat.slug as category_slug, cat.icon as category_icon
    FROM tourist_places p
    JOIN cities c ON p.city_id = c.id
    JOIN categories cat ON p.category_id = cat.id
    WHERE 1=1
    '''
    params = []

    if city_id and city_id != 'all':
        query += " AND p.city_id = ?"
        params.append(city_id)
    elif city_name and city_name.lower() != 'all':
        query += " AND LOWER(c.name) = LOWER(?)"
        params.append(city_name)

    if category_id and category_id != 'all':
        query += " AND p.category_id = ?"
        params.append(category_id)
    elif category_slug and category_slug != 'all':
        query += " AND cat.slug = ?"
        params.append(category_slug)

    if search:
        search_term = f"%{search}%"
        query += " AND (p.name LIKE ? OR p.description LIKE ? OR p.address LIKE ? OR cat.name LIKE ? OR c.name LIKE ?)"
        params.extend([search_term, search_term, search_term, search_term, search_term])

    if min_rating:
        query += " AND p.rating >= ?"
        params.append(float(min_rating))

    if max_fee:
        query += " AND p.entry_fee <= ?"
        params.append(float(max_fee))

    if featured:
        query += " AND p.is_featured = 1"

    # Sorting
    if sort_by == 'rating_desc':
        query += " ORDER BY p.rating DESC, p.review_count DESC"
    elif sort_by == 'rating_asc':
        query += " ORDER BY p.rating ASC"
    elif sort_by == 'fee_asc':
        query += " ORDER BY p.entry_fee ASC"
    elif sort_by == 'fee_desc':
        query += " ORDER BY p.entry_fee DESC"
    elif sort_by == 'distance_asc':
        query += " ORDER BY p.distance_km ASC"
    elif sort_by == 'name_asc':
        query += " ORDER BY p.name ASC"
    else:
        query += " ORDER BY p.id DESC"

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()

    places = []
    for r in rows:
        d = dict(r)
        try:
            d['gallery'] = json.loads(d.get('gallery_json') or '[]')
            d['tags'] = json.loads(d.get('tags_json') or '[]')
        except Exception:
            d['gallery'] = []
            d['tags'] = []
        places.append(d)

    conn.close()
    return jsonify({
        'places': places,
        'count': len(places),
        'is_public': True
    })

@places_bp.route('/cities', methods=['GET'])
def get_cities():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT c.*, 
           (SELECT COUNT(*) FROM tourist_places WHERE city_id = c.id) as places_count,
           (SELECT COUNT(*) FROM services WHERE city_id = c.id) as services_count
    FROM cities c
    ORDER BY c.name ASC
    ''')
    rows = cursor.fetchall()
    conn.close()
    return jsonify({'cities': [dict(r) for r in rows]})

@places_bp.route('/categories', methods=['GET'])
def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT c.*, 
           (SELECT COUNT(*) FROM tourist_places WHERE category_id = c.id) as places_count
    FROM categories c
    ORDER BY c.id ASC
    ''')
    rows = cursor.fetchall()
    conn.close()
    return jsonify({'categories': [dict(r) for r in rows]})

@places_bp.route('/places/<int:place_id>', methods=['GET'])
@optional_auth
def get_place(place_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT p.*, c.name as city_name, c.state as city_state,
           cat.name as category_name, cat.slug as category_slug, cat.icon as category_icon
    FROM tourist_places p
    JOIN cities c ON p.city_id = c.id
    JOIN categories cat ON p.category_id = cat.id
    WHERE p.id = ?
    ''', (place_id,))
    row = cursor.fetchone()

    if not row:
        conn.close()
        return jsonify({'error': 'Tourist place not found'}), 404

    place = dict(row)
    try:
        place['gallery'] = json.loads(place.get('gallery_json') or '[]')
        place['tags'] = json.loads(place.get('tags_json') or '[]')
    except Exception:
        place['gallery'] = []
        place['tags'] = []

    # Get reviews for this place
    cursor.execute('''
    SELECT r.*, u.profile_pic as user_pic
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.place_id = ?
    ORDER BY r.created_at DESC
    ''', (place_id,))
    place['reviews'] = [dict(r) for r in cursor.fetchall()]

    # Calculate ratings distribution
    cursor.execute('''
    SELECT rating, COUNT(*) as count 
    FROM reviews 
    WHERE place_id = ? 
    GROUP BY rating
    ''', (place_id,))
    dist_rows = cursor.fetchall()
    rating_distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for dr in dist_rows:
        rating_distribution[dr['rating']] = dr['count']
    place['rating_distribution'] = rating_distribution

    # Get nearby services for this place
    cursor.execute('''
    SELECT * FROM services 
    WHERE city_id = ? AND (place_id = ? OR place_id IS NULL)
    ORDER BY distance_km ASC
    ''', (place['city_id'], place_id))
    place['nearby_services'] = [dict(s) for s in cursor.fetchall()]

    conn.close()
    return jsonify({'place': place})

@places_bp.route('/places', methods=['POST'])
@requires_admin
def create_place():
    data = request.get_json() or {}
    city_id = data.get('city_id')
    category_id = data.get('category_id')
    name = data.get('name', '').strip()

    if not city_id or not category_id or not name:
        return jsonify({'error': 'City, category, and place name are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO tourist_places (
        city_id, category_id, name, description, address, lat, lng,
        image_url, gallery_json, rating, review_count, entry_fee,
        opening_hours, best_time, distance_km, tags_json, is_featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        city_id, category_id, name,
        data.get('description', ''),
        data.get('address', ''),
        float(data.get('lat', 11.0168)),
        float(data.get('lng', 76.9558)),
        data.get('image_url', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800'),
        json.dumps(data.get('gallery', [])),
        float(data.get('rating', 4.5)),
        int(data.get('review_count', 0)),
        float(data.get('entry_fee', 0)),
        data.get('opening_hours', '9:00 AM - 6:00 PM'),
        data.get('best_time', 'All Seasons'),
        float(data.get('distance_km', 5.0)),
        json.dumps(data.get('tags', [])),
        1 if data.get('is_featured') else 0
    ))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return jsonify({'message': 'Tourist place created successfully', 'place_id': new_id}), 201

@places_bp.route('/places/<int:place_id>', methods=['PUT'])
@requires_admin
def update_place(place_id):
    data = request.get_json() or {}
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
    UPDATE tourist_places SET
        name = COALESCE(?, name),
        description = COALESCE(?, description),
        address = COALESCE(?, address),
        city_id = COALESCE(?, city_id),
        category_id = COALESCE(?, category_id),
        lat = COALESCE(?, lat),
        lng = COALESCE(?, lng),
        image_url = COALESCE(?, image_url),
        entry_fee = COALESCE(?, entry_fee),
        opening_hours = COALESCE(?, opening_hours),
        best_time = COALESCE(?, best_time),
        distance_km = COALESCE(?, distance_km),
        is_featured = COALESCE(?, is_featured)
    WHERE id = ?
    ''', (
        data.get('name'),
        data.get('description'),
        data.get('address'),
        data.get('city_id'),
        data.get('category_id'),
        data.get('lat'),
        data.get('lng'),
        data.get('image_url'),
        data.get('entry_fee'),
        data.get('opening_hours'),
        data.get('best_time'),
        data.get('distance_km'),
        1 if data.get('is_featured') else 0 if 'is_featured' in data else None,
        place_id
    ))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Tourist place updated successfully'})

@places_bp.route('/places/<int:place_id>', methods=['DELETE'])
@requires_admin
def delete_place(place_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tourist_places WHERE id = ?", (place_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Tourist place deleted successfully'})
