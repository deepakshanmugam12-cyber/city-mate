from flask import Blueprint, request, jsonify, g
from database import get_db_connection
from auth import requires_auth, optional_auth
import json

recommendations_bp = Blueprint('recommendations', __name__)

@recommendations_bp.route('/recommendations', methods=['POST', 'GET'])
@optional_auth
def get_recommendations():
    data = request.get_json(silent=True) or {}
    if request.method == 'GET':
        data = {
            'city_id': request.args.get('city_id'),
            'interests': request.args.getlist('interests') or ['nature', 'temple'],
            'budget': request.args.get('budget', 'medium'),
            'available_time': request.args.get('available_time', 'full-day'),
            'max_distance': request.args.get('max_distance', 50)
        }

    city_id = data.get('city_id')
    interests = [i.lower() for i in data.get('interests', [])]
    budget = data.get('budget', 'medium').lower()
    available_time = data.get('available_time', 'full-day')
    max_distance = float(data.get('max_distance', 50))

    conn = get_db_connection()
    cursor = conn.cursor()

    query = '''
    SELECT p.*, c.name as city_name, cat.name as category_name, cat.slug as category_slug, cat.icon as category_icon
    FROM tourist_places p
    JOIN cities c ON p.city_id = c.id
    JOIN categories cat ON p.category_id = cat.id
    '''
    params = []
    if city_id and str(city_id) != 'all':
        query += " WHERE p.city_id = ?"
        params.append(city_id)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    scored_places = []
    for r in rows:
        place = dict(r)
        try:
            place['tags'] = json.loads(place.get('tags_json') or '[]')
            place['gallery'] = json.loads(place.get('gallery_json') or '[]')
        except Exception:
            place['tags'] = []
            place['gallery'] = []

        score = 0
        reasons = []

        # 1. Category and interest match
        cat_slug = place.get('category_slug', '').lower()
        matched_interests = []

        if cat_slug in interests:
            score += 45
            matched_interests.append(place.get('category_name'))

        # Check tags
        for tag in place['tags']:
            for interest in interests:
                if interest in tag.lower():
                    score += 15
                    if interest.capitalize() not in matched_interests:
                        matched_interests.append(interest.capitalize())

        # 2. Rating boost
        rating = place.get('rating', 4.0)
        score += int(rating * 8)

        # 3. Budget match
        fee = place.get('entry_fee', 0)
        if budget == 'low':
            if fee == 0:
                score += 20
                reasons.append("Free entry matches your low-budget preference")
            elif fee <= 50:
                score += 10
            else:
                score -= 15
        elif budget == 'medium':
            if fee <= 250:
                score += 15
        elif budget == 'high':
            score += 15

        # 4. Distance match
        dist = place.get('distance_km', 10.0)
        if dist <= max_distance:
            score += 15
        else:
            score -= 10

        # Build personalized reason string
        if matched_interests:
            reason_text = f"Recommended because you selected {', '.join(matched_interests[:2])}"
            if fee == 0 and budget == 'low':
                reason_text += " with free entry"
            elif dist <= 10:
                reason_text += " and it is conveniently nearby"
            else:
                reason_text += f" matching your {available_time} travel plans"
            reason_text += "."
        else:
            reason_text = f"Highly rated highlight with {rating}★ in {place['city_name']}."

        match_percent = min(99, max(65, int(score * 0.95)))

        place['recommendation_score'] = score
        place['match_percentage'] = match_percent
        place['recommendation_reason'] = reason_text

        scored_places.append(place)

    # Sort by recommendation score descending
    scored_places.sort(key=lambda x: x['recommendation_score'], reverse=True)

    return jsonify({
        'authenticated_user': (g.current_user.get('username') or g.current_user.get('full_name')) if g.current_user else 'Guest',
        'recommendations': scored_places[:10],
        'total_evaluated': len(scored_places),
        'algorithm_version': '1.0-heuristic-scoring'
    })
