from flask import Blueprint, request, jsonify, g, redirect
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db_connection
from auth import requires_auth, optional_auth

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/status', methods=['GET'])
@optional_auth
def auth_status():
    """
    Checks if client provided valid HTTP Basic Auth credentials.
    Returns authentication status and user details without forcing a 401.
    """
    if g.current_user:
        return jsonify({
            'authenticated': True,
            'user': {
                'id': g.current_user.get('id'),
                'username': g.current_user.get('username') or g.current_user.get('full_name'),
                'full_name': g.current_user.get('full_name'),
                'email': g.current_user.get('email'),
                'role': g.current_user.get('role')
            }
        }), 200

    return jsonify({
        'authenticated': False,
        'user': None
    }), 200

@auth_bp.route('/signin', methods=['GET'])
@requires_auth(role='user')
def auth_signin():
    """
    Protected endpoint to trigger browser's native HTTP Basic Auth prompt.
    Once authenticated, redirects user back to the main app or login-info.
    """
    next_url = request.args.get('next', '/')
    return redirect(next_url)

@auth_bp.route('/logout', methods=['GET'])
def auth_logout():
    """
    HTTP Basic Auth logout explanation.
    HTTP Basic Auth credentials are maintained by the browser in memory.
    """
    return jsonify({
        'message': 'HTTP Basic Auth credentials remain cached in browser memory for the session.',
        'instruction': 'To completely log out, close all browser windows or switch accounts by re-authenticating.',
        'logged_out': True
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@requires_auth(role='user')
def get_profile():
    user = g.current_user
    user_id = user['id']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, full_name, email, phone, role, profile_pic, created_at FROM users WHERE id = ?", (user_id,))
    user_row = cursor.fetchone()

    if user_row:
        user_data = dict(user_row)
    else:
        user_data = {
            'id': user_id,
            'full_name': user.get('full_name') or user.get('username'),
            'email': user.get('email', 'traveler@citymate.com'),
            'phone': '+91 9845123456',
            'role': user.get('role', 'user'),
            'profile_pic': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
            'created_at': '2026-01-01'
        }

    # Get user favorites
    cursor.execute('''
    SELECT p.*, c.name as city_name, cat.name as category_name
    FROM favorites f
    JOIN tourist_places p ON f.place_id = p.id
    JOIN cities c ON p.city_id = c.id
    JOIN categories cat ON p.category_id = cat.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
    ''', (user_id,))
    user_data['favorites'] = [dict(r) for r in cursor.fetchall()]

    # Get user reviews
    cursor.execute('''
    SELECT r.*, p.name as place_name, p.image_url as place_image
    FROM reviews r
    JOIN tourist_places p ON r.place_id = p.id
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
    ''', (user_id,))
    user_data['reviews'] = [dict(r) for r in cursor.fetchall()]

    conn.close()
    return jsonify({
        'authenticated_via': 'HTTP Basic Auth',
        'user': user_data
    }), 200

@auth_bp.route('/profile', methods=['PUT'])
@requires_auth(role='user')
def update_profile():
    data = request.get_json() or {}
    user = g.current_user
    user_id = user['id']
    full_name = data.get('full_name', '').strip()
    phone = data.get('phone', '').strip()
    profile_pic = data.get('profile_pic', '').strip()

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
    UPDATE users 
    SET full_name = COALESCE(NULLIF(?, ''), full_name),
        phone = COALESCE(NULLIF(?, ''), phone),
        profile_pic = COALESCE(NULLIF(?, ''), profile_pic)
    WHERE id = ?
    ''', (full_name, phone, profile_pic, user_id))
    conn.commit()

    cursor.execute("SELECT id, full_name, email, phone, role, profile_pic FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()

    updated = dict(row) if row else {
        'id': user_id,
        'full_name': full_name or user.get('full_name'),
        'phone': phone,
        'profile_pic': profile_pic,
        'role': user.get('role')
    }

    return jsonify({'message': 'Profile updated successfully', 'user': updated}), 200
