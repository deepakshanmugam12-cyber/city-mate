from flask import Blueprint, request, jsonify, g
from database import get_db_connection
from auth import requires_auth, optional_auth

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/reviews', methods=['GET'])
@optional_auth
def get_reviews():
    place_id = request.args.get('place_id')
    user_id = request.args.get('user_id')

    query = '''
    SELECT r.*, p.name as place_name, u.profile_pic as user_pic
    FROM reviews r
    JOIN tourist_places p ON r.place_id = p.id
    LEFT JOIN users u ON r.user_id = u.id
    WHERE 1=1
    '''
    params = []
    if place_id:
        query += " AND r.place_id = ?"
        params.append(place_id)
    if user_id:
        query += " AND r.user_id = ?"
        params.append(user_id)

    query += " ORDER BY r.created_at DESC"

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return jsonify({'reviews': [dict(r) for r in rows]})

@reviews_bp.route('/reviews', methods=['POST'])
@requires_auth(role='user')
def add_review():
    data = request.get_json() or {}
    user = g.current_user
    place_id = data.get('place_id')
    user_id = user['id']
    rating = data.get('rating')
    comment = data.get('comment', '').strip()
    user_name = user.get('full_name') or user.get('username') or 'Traveler'

    if not place_id or not rating or not comment:
        return jsonify({'error': 'Place, rating (1-5), and review comment are required'}), 400

    try:
        rating = int(rating)
        if rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid rating number'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
    INSERT INTO reviews (place_id, user_id, rating, comment, user_name)
    VALUES (?, ?, ?, ?, ?)
    ''', (place_id, user_id, rating, comment, user_name))
    new_id = cursor.lastrowid

    # Recalculate average rating & review count for the place
    cursor.execute('''
    SELECT AVG(rating) as avg_rating, COUNT(*) as cnt 
    FROM reviews 
    WHERE place_id = ?
    ''', (place_id,))
    stat = cursor.fetchone()
    avg_rating = round(stat['avg_rating'], 1) if stat and stat['avg_rating'] else 4.5
    cnt = stat['cnt'] if stat else 1

    cursor.execute('''
    UPDATE tourist_places 
    SET rating = ?, review_count = ?
    WHERE id = ?
    ''', (avg_rating, cnt, place_id))

    conn.commit()
    conn.close()

    return jsonify({
        'message': 'Review published successfully!',
        'review_id': new_id,
        'new_rating': avg_rating,
        'user_name': user_name
    }), 201

@reviews_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
@requires_auth(role='user')
def delete_review(review_id):
    user = g.current_user
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT place_id, user_id FROM reviews WHERE id = ?", (review_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({'error': 'Review not found'}), 404

    # Allow if user is admin or the author
    if user.get('role') != 'admin' and row['user_id'] != user['id']:
        conn.close()
        return jsonify({'error': 'Forbidden', 'message': 'You can only delete your own reviews.'}), 403

    place_id = row['place_id']
    cursor.execute("DELETE FROM reviews WHERE id = ?", (review_id,))

    cursor.execute("SELECT AVG(rating) as avg_rating, COUNT(*) as cnt FROM reviews WHERE place_id = ?", (place_id,))
    stat = cursor.fetchone()
    avg_rating = round(stat['avg_rating'], 1) if stat and stat['avg_rating'] else 4.5
    cnt = stat['cnt'] if stat else 0
    cursor.execute("UPDATE tourist_places SET rating = ?, review_count = ? WHERE id = ?", (avg_rating, cnt, place_id))

    conn.commit()
    conn.close()

    return jsonify({'message': 'Review deleted successfully'})
