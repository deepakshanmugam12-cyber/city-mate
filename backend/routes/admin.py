from flask import Blueprint, request, jsonify, g
from database import get_db_connection
from auth import requires_admin

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/stats', methods=['GET'])
@requires_admin
def get_admin_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM users")
    total_users = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM tourist_places")
    total_places = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM services")
    total_services = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM reviews")
    total_reviews = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM favorites")
    total_favorites = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM cities")
    total_cities = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*), AVG(rating) FROM feedbacks")
    fb_row = cursor.fetchone()
    total_feedbacks = fb_row[0] if fb_row else 0
    avg_feedback_rating = round(fb_row[1], 1) if fb_row and fb_row[1] else 4.8

    # Category breakdown for visual charts
    cursor.execute('''
    SELECT cat.name, COUNT(p.id) as count
    FROM categories cat
    LEFT JOIN tourist_places p ON cat.id = p.category_id
    GROUP BY cat.id
    ORDER BY count DESC
    ''')
    category_breakdown = [dict(r) for r in cursor.fetchall()]

    # Service breakdown for visual charts
    cursor.execute('''
    SELECT service_type, COUNT(*) as count
    FROM services
    GROUP BY service_type
    ORDER BY count DESC
    ''')
    services_breakdown = [dict(r) for r in cursor.fetchall()]

    # Recent reviews
    cursor.execute('''
    SELECT r.*, p.name as place_name, u.email as user_email
    FROM reviews r
    JOIN tourist_places p ON r.place_id = p.id
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
    LIMIT 6
    ''')
    recent_reviews = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT COUNT(*), SUM(CASE WHEN status='confirmed' THEN total_amount ELSE 0 END) FROM bookings")
    b_row = cursor.fetchone()
    total_bookings = b_row[0] if b_row else 0
    total_sales_revenue = round(b_row[1] or 0.0, 2) if b_row else 0.0

    conn.close()

    return jsonify({
        'admin_user': g.current_user.get('username') or g.current_user.get('full_name'),
        'stats': {
            'total_users': total_users,
            'total_places': total_places,
            'total_services': total_services,
            'total_reviews': total_reviews,
            'total_favorites': total_favorites,
            'total_cities': total_cities,
            'total_feedbacks': total_feedbacks,
            'avg_feedback_rating': avg_feedback_rating,
            'total_bookings': total_bookings,
            'total_sales_revenue': total_sales_revenue
        },
        'category_breakdown': category_breakdown,
        'services_breakdown': services_breakdown,
        'recent_reviews': recent_reviews
    })

@admin_bp.route('/admin/users', methods=['GET'])
@requires_admin
def get_admin_users():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT id, full_name, email, phone, role, profile_pic, is_active, created_at,
           (SELECT COUNT(*) FROM reviews WHERE user_id = users.id) as reviews_count,
           (SELECT COUNT(*) FROM favorites WHERE user_id = users.id) as favorites_count
    FROM users
    ORDER BY id DESC
    ''')
    rows = cursor.fetchall()
    conn.close()
    return jsonify({'users': [dict(r) for r in rows]})

@admin_bp.route('/admin/users/<int:user_id>/toggle-status', methods=['POST'])
@requires_admin
def toggle_user_status(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, is_active, role FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return jsonify({'error': 'User not found'}), 404

    if row['role'] == 'admin':
        conn.close()
        return jsonify({'error': 'Cannot deactivate administrator account'}), 400

    new_status = 0 if row['is_active'] else 1
    cursor.execute("UPDATE users SET is_active = ? WHERE id = ?", (new_status, user_id))
    conn.commit()
    conn.close()

    status_str = "activated" if new_status else "deactivated"
    return jsonify({'message': f'User successfully {status_str}', 'is_active': new_status})

@admin_bp.route('/admin/categories', methods=['POST'])
@requires_admin
def add_category():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    slug = data.get('slug', name.lower().replace(' ', '-')).strip()
    icon = data.get('icon', 'tag').strip()
    description = data.get('description', '').strip()

    if not name or not slug:
        return jsonify({'error': 'Category name and slug are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
        INSERT INTO categories (name, icon, slug, description)
        VALUES (?, ?, ?, ?)
        ''', (name, icon, slug, description))
        conn.commit()
        cat_id = cursor.lastrowid
        conn.close()
        return jsonify({'message': 'Category added successfully', 'category_id': cat_id}), 201
    except Exception as e:
        conn.close()
        return jsonify({'error': f'Failed to create category: {str(e)}'}), 400

@admin_bp.route('/admin/categories/<int:cat_id>', methods=['DELETE'])
@requires_admin
def delete_category(cat_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM categories WHERE id = ?", (cat_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Category deleted successfully'})
