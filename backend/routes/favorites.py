from flask import Blueprint, request, jsonify, g
from database import get_db_connection
from auth import requires_auth

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/favorites', methods=['GET'])
@requires_auth(role='user')
def get_favorites():
    # Use authenticated user from Basic Auth
    user = g.current_user
    user_id = user['id']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT p.*, c.name as city_name, cat.name as category_name, cat.slug as category_slug, f.created_at as favorited_at
    FROM favorites f
    JOIN tourist_places p ON f.place_id = p.id
    JOIN cities c ON p.city_id = c.id
    JOIN categories cat ON p.category_id = cat.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
    ''', (user_id,))
    rows = cursor.fetchall()
    conn.close()

    return jsonify({
        'user': user,
        'favorites': [dict(r) for r in rows]
    })

@favorites_bp.route('/favorites/toggle', methods=['POST'])
@requires_auth(role='user')
def toggle_favorite():
    data = request.get_json() or {}
    user = g.current_user
    user_id = user['id']
    place_id = data.get('place_id')

    if not place_id:
        return jsonify({'error': 'Place ID is required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM favorites WHERE user_id = ? AND place_id = ?", (user_id, place_id))
    existing = cursor.fetchone()

    if existing:
        cursor.execute("DELETE FROM favorites WHERE id = ?", (existing['id'],))
        is_favorite = False
        message = "Removed from favorites"
    else:
        cursor.execute("INSERT INTO favorites (user_id, place_id) VALUES (?, ?)", (user_id, place_id))
        is_favorite = True
        message = "Added to favorites"

    conn.commit()
    conn.close()

    return jsonify({
        'message': message,
        'is_favorite': is_favorite,
        'username': user.get('username') or user.get('full_name')
    })
