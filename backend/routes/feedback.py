from flask import Blueprint, request, jsonify, g
from database import get_db_connection
from auth import requires_admin, optional_auth

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/feedback', methods=['GET'])
@optional_auth
def get_feedbacks():
    feedback_type = request.args.get('type')
    min_rating = request.args.get('min_rating')
    limit = request.args.get('limit', default=50, type=int)

    query = '''
    SELECT f.*, u.profile_pic as user_pic
    FROM feedbacks f
    LEFT JOIN users u ON f.user_id = u.id
    WHERE 1=1
    '''
    params = []

    if feedback_type and feedback_type != 'All':
        query += " AND f.feedback_type = ?"
        params.append(feedback_type)

    if min_rating:
        query += " AND f.rating >= ?"
        params.append(int(min_rating))

    query += " ORDER BY f.created_at DESC LIMIT ?"
    params.append(limit)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(query, params)
    rows = cursor.fetchall()

    # Also compute overall stats
    cursor.execute('''
    SELECT 
        COUNT(*) as total_count,
        AVG(rating) as avg_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
    FROM feedbacks
    ''')
    stats_row = cursor.fetchone()
    conn.close()

    total = stats_row['total_count'] if stats_row and stats_row['total_count'] else 0
    avg_rating = round(stats_row['avg_rating'], 1) if stats_row and stats_row['avg_rating'] else 4.8
    satisfaction_rate = round(((stats_row['five_star'] + stats_row['four_star']) / total * 100)) if total > 0 else 96

    stats = {
        'total_feedbacks': total,
        'avg_rating': avg_rating,
        'satisfaction_percentage': satisfaction_rate,
        'five_star': stats_row['five_star'] if stats_row else 0,
        'four_star': stats_row['four_star'] if stats_row else 0,
        'three_star': stats_row['three_star'] if stats_row else 0,
        'two_star': stats_row['two_star'] if stats_row else 0,
        'one_star': stats_row['one_star'] if stats_row else 0,
    }

    return jsonify({
        'feedbacks': [dict(r) for r in rows],
        'stats': stats
    })

@feedback_bp.route('/feedback', methods=['POST'])
@optional_auth
def submit_feedback():
    data = request.get_json() or {}
    
    # User might be logged in or submitting as guest
    current_user = getattr(g, 'current_user', None)
    user_id = current_user['id'] if current_user else None

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    feedback_type = data.get('feedback_type', 'General Feedback').strip()
    rating = data.get('rating')
    subject = data.get('subject', '').strip()
    message = data.get('message', '').strip()
    tags = data.get('tags', '').strip()

    # Fallback to logged-in user details if available
    if current_user:
        if not name:
            name = current_user.get('full_name') or current_user.get('username') or 'Traveler'
        if not email:
            email = current_user.get('email') or 'traveler@citymate.com'

    if not name or not email or not message or not rating:
        return jsonify({'error': 'Name, email, rating (1-5), and message are required.'}), 400

    try:
        rating = int(rating)
        if rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be an integer between 1 and 5.'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid rating number.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
    INSERT INTO feedbacks (user_id, name, email, feedback_type, rating, subject, message, tags, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    ''', (user_id, name, email, feedback_type, rating, subject, message, tags))

    new_id = cursor.lastrowid
    conn.commit()

    # Fetch inserted row
    cursor.execute('''
    SELECT f.*, u.profile_pic as user_pic
    FROM feedbacks f
    LEFT JOIN users u ON f.user_id = u.id
    WHERE f.id = ?
    ''', (new_id,))
    row = cursor.fetchone()
    conn.close()

    return jsonify({
        'message': 'Thank you! Your feedback has been received and helps make CityMate better.',
        'feedback': dict(row) if row else {'id': new_id}
    }), 201

@feedback_bp.route('/feedback/stats', methods=['GET'])
def get_feedback_stats():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
    SELECT 
        COUNT(*) as total_count,
        AVG(rating) as avg_rating,
        SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
    FROM feedbacks
    ''')
    stat = cursor.fetchone()

    cursor.execute('''
    SELECT feedback_type, COUNT(*) as count
    FROM feedbacks
    GROUP BY feedback_type
    ORDER BY count DESC
    ''')
    type_counts = [dict(r) for r in cursor.fetchall()]

    conn.close()

    total = stat['total_count'] if stat and stat['total_count'] else 0
    avg_rating = round(stat['avg_rating'], 1) if stat and stat['avg_rating'] else 4.8

    return jsonify({
        'total': total,
        'avg_rating': avg_rating,
        'breakdown': {
            5: stat['five_star'] if stat else 0,
            4: stat['four_star'] if stat else 0,
            3: stat['three_star'] if stat else 0,
            2: stat['two_star'] if stat else 0,
            1: stat['one_star'] if stat else 0
        },
        'by_type': type_counts
    })

# --- Admin Feedback Routes ---
@feedback_bp.route('/admin/feedback', methods=['GET'])
@requires_admin
def admin_get_feedbacks():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
    SELECT f.*, u.profile_pic as user_pic
    FROM feedbacks f
    LEFT JOIN users u ON f.user_id = u.id
    ORDER BY f.created_at DESC
    ''')
    rows = cursor.fetchall()
    conn.close()
    return jsonify({'feedbacks': [dict(r) for r in rows]})

@feedback_bp.route('/admin/feedback/<int:feedback_id>/status', methods=['PUT'])
@requires_admin
def admin_update_feedback_status(feedback_id):
    data = request.get_json() or {}
    new_status = data.get('status', 'Reviewed')
    admin_notes = data.get('admin_notes', '')

    if new_status not in ['Pending', 'Reviewed', 'Resolved']:
        return jsonify({'error': 'Invalid status. Choose Pending, Reviewed, or Resolved.'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
    UPDATE feedbacks
    SET status = ?, admin_notes = ?
    WHERE id = ?
    ''', (new_status, admin_notes, feedback_id))
    conn.commit()
    conn.close()

    return jsonify({'message': f'Feedback #{feedback_id} status updated to {new_status}.', 'status': new_status})

@feedback_bp.route('/admin/feedback/<int:feedback_id>', methods=['DELETE'])
@requires_admin
def admin_delete_feedback(feedback_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM feedbacks WHERE id = ?", (feedback_id,))
    conn.commit()
    conn.close()

    return jsonify({'message': f'Feedback #{feedback_id} deleted successfully.'})
