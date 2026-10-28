from flask import Blueprint, request, jsonify
from database import get_db_connection

services_bp = Blueprint('services', __name__)

@services_bp.route('/services', methods=['GET'])
def get_services():
    city_id = request.args.get('city_id')
    service_type = request.args.get('service_type')
    place_id = request.args.get('place_id')
    search = request.args.get('search', '').strip()

    query = '''
    SELECT s.*, c.name as city_name, p.name as place_name
    FROM services s
    JOIN cities c ON s.city_id = c.id
    LEFT JOIN tourist_places p ON s.place_id = p.id
    WHERE 1=1
    '''
    params = []

    if city_id and city_id != 'all':
        query += " AND s.city_id = ?"
        params.append(city_id)

    if service_type and service_type != 'all':
        query += " AND s.service_type = ?"
        params.append(service_type)

    if place_id:
        query += " AND s.place_id = ?"
        params.append(place_id)

    if search:
        search_term = f"%{search}%"
        query += " AND (s.name LIKE ? OR s.address LIKE ? OR s.service_type LIKE ?)"
        params.extend([search_term, search_term, search_term])

    query += " ORDER BY s.distance_km ASC"

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return jsonify({'services': [dict(r) for r in rows], 'count': len(rows)})

@services_bp.route('/services', methods=['POST'])
def create_service():
    data = request.get_json() or {}
    city_id = data.get('city_id')
    service_type = data.get('service_type')
    name = data.get('name', '').strip()

    if not city_id or not service_type or not name:
        return jsonify({'error': 'City, service type, and name are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
    INSERT INTO services (
        city_id, place_id, service_type, name, address, lat, lng,
        rating, phone, opening_status, image_url, distance_km, price_level
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        city_id,
        data.get('place_id'),
        service_type,
        name,
        data.get('address', ''),
        float(data.get('lat', 11.0168)),
        float(data.get('lng', 76.9558)),
        float(data.get('rating', 4.5)),
        data.get('phone', ''),
        data.get('opening_status', 'Open Now'),
        data.get('image_url', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'),
        float(data.get('distance_km', 1.0)),
        data.get('price_level', '$$')
    ))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return jsonify({'message': 'Service created successfully', 'service_id': new_id}), 201

@services_bp.route('/services/<int:service_id>', methods=['PUT'])
def update_service(service_id):
    data = request.get_json() or {}
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
    UPDATE services SET
        name = COALESCE(?, name),
        service_type = COALESCE(?, service_type),
        address = COALESCE(?, address),
        phone = COALESCE(?, phone),
        opening_status = COALESCE(?, opening_status),
        rating = COALESCE(?, rating),
        distance_km = COALESCE(?, distance_km),
        price_level = COALESCE(?, price_level),
        image_url = COALESCE(?, image_url)
    WHERE id = ?
    ''', (
        data.get('name'),
        data.get('service_type'),
        data.get('address'),
        data.get('phone'),
        data.get('opening_status'),
        data.get('rating'),
        data.get('distance_km'),
        data.get('price_level'),
        data.get('image_url'),
        service_id
    ))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Service updated successfully'})

@services_bp.route('/services/<int:service_id>', methods=['DELETE'])
def delete_service(service_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM services WHERE id = ?", (service_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Service deleted successfully'})
