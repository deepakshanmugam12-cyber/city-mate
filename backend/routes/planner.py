from flask import Blueprint, request, jsonify
from database import get_db_connection
import json

planner_bp = Blueprint('planner', __name__)

@planner_bp.route('/trip-planner', methods=['POST'])
def generate_trip_plan():
    data = request.get_json() or {}
    city_id = data.get('city_id')
    user_id = data.get('user_id')

    try:
        days = int(data.get('days') or 2)
        if days < 1:
            days = 1
        elif days > 14:
            days = 14
    except (ValueError, TypeError):
        days = 2

    raw_interests = data.get('interests')
    if isinstance(raw_interests, list):
        interests = [str(i).strip().lower() for i in raw_interests if i]
    elif isinstance(raw_interests, str) and raw_interests.strip():
        interests = [i.strip().lower() for i in raw_interests.split(',') if i.strip()]
    else:
        interests = ['nature', 'temple', 'historical', 'shopping']
    if not interests:
        interests = ['nature', 'temple', 'historical', 'shopping']

    budget = (data.get('budget') or 'moderate').lower().strip()
    if budget not in ('budget', 'moderate', 'luxury'):
        budget = 'moderate'

    try:
        city_id = int(city_id)
    except (ValueError, TypeError):
        return jsonify({'error': 'Valid City ID is required to generate trip plan'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Fetch Destination City
    cursor.execute("SELECT * FROM cities WHERE id = ?", (city_id,))
    city_row = cursor.fetchone()
    if not city_row:
        conn.close()
        return jsonify({'error': 'Destination City not found'}), 404
    city = dict(city_row)

    # 2. Fetch Tourist Places for this Destination City
    cursor.execute('''
    SELECT p.*, COALESCE(cat.name, 'Landmark') as category_name, COALESCE(cat.slug, 'landmark') as category_slug
    FROM tourist_places p
    LEFT JOIN categories cat ON p.category_id = cat.id
    WHERE p.city_id = ?
    ORDER BY p.rating DESC, p.review_count DESC
    ''', (city_id,))
    all_places = [dict(r) for r in cursor.fetchall()]

    for p in all_places:
        raw_tags = p.get('tags_json')
        if isinstance(raw_tags, list):
            p['tags'] = raw_tags
        elif isinstance(raw_tags, str) and raw_tags.strip():
            try:
                p['tags'] = json.loads(raw_tags)
            except Exception:
                p['tags'] = [t.strip() for t in raw_tags.split(',') if t.strip()]
        else:
            p['tags'] = []

        raw_gallery = p.get('gallery_json')
        if isinstance(raw_gallery, list):
            p['gallery'] = raw_gallery
        elif isinstance(raw_gallery, str) and raw_gallery.strip():
            try:
                p['gallery'] = json.loads(raw_gallery)
            except Exception:
                p['gallery'] = [raw_gallery]
        else:
            p['gallery'] = []

    # 3. Fetch Services for this Destination City
    cursor.execute('''
    SELECT * FROM services
    WHERE city_id = ?
    ORDER BY rating DESC
    ''', (city_id,))
    all_services = [dict(r) for r in cursor.fetchall()]

    conn.close()

    # Separate Services
    restaurants = [s for s in all_services if s['service_type'] == 'restaurant']
    hotels = [s for s in all_services if s['service_type'] == 'hotel']
    hospitals = [s for s in all_services if s['service_type'] == 'hospital']
    police_list = [s for s in all_services if s['service_type'] == 'police']
    atms = [s for s in all_services if s['service_type'] == 'atm']
    petrol_bunks = [s for s in all_services if s['service_type'] == 'petrol_bunk']
    markets = [s for s in all_services if s['service_type'] == 'market']
    rentals = [s for s in all_services if s['service_type'] == 'rental']

    # Classify Restaurants for Breakfast, Lunch, and Dinner
    breakfast_keywords = ['breakfast', 'tiffin', 'morning', 'cafe', 'bakery', 'idli', 'coffee', 'bakes', 'waffles']
    lunch_keywords = ['lunch', 'meals', 'thali', 'mess', 'biryani', 'bistro', 'feast']
    dinner_keywords = ['dinner', 'rooftop', 'grill', 'barbecue', 'candlelight', 'pavilion', 'buffet', 'terrace', 'fine dining']

    breakfast_restaurants = []
    lunch_restaurants = []
    dinner_restaurants = []

    for r in restaurants:
        searchable_text = f"{r.get('name', '')} {r.get('opening_status', '')} {r.get('address', '')}".lower()
        is_breakfast = any(k in searchable_text for k in breakfast_keywords)
        is_lunch = any(k in searchable_text for k in lunch_keywords)
        is_dinner = any(k in searchable_text for k in dinner_keywords)

        if is_breakfast:
            breakfast_restaurants.append(r)
        if is_lunch:
            lunch_restaurants.append(r)
        if is_dinner:
            dinner_restaurants.append(r)

    # Fallback if any meal category is sparse
    if not breakfast_restaurants:
        breakfast_restaurants = [r for r in restaurants if r.get('price_level') in ('$', '$$')] or restaurants
    if not lunch_restaurants:
        lunch_restaurants = restaurants
    if not dinner_restaurants:
        dinner_restaurants = [r for r in restaurants if r.get('price_level') in ('$$', '$$$', '$$$$')] or restaurants

    # Filter Hotels by user's Budget Level
    if budget == 'budget':
        matched_hotels = [h for h in hotels if h.get('price_level') == '$'] or hotels
    elif budget == 'luxury':
        matched_hotels = [h for h in hotels if h.get('price_level') in ('$$$$', '$$$')] or hotels
    else: # moderate
        matched_hotels = [h for h in hotels if h.get('price_level') in ('$$', '$$$')] or hotels

    # Rank tourist places based on User Interests
    matched_places = []
    other_places = []
    for p in all_places:
        cat = p.get('category_slug', '').lower()
        tags = [t.lower() for t in p.get('tags', [])]
        if cat in interests or any(i in tags for i in interests):
            matched_places.append(p)
        else:
            other_places.append(p)

    candidate_places = matched_places + other_places
    if not candidate_places:
        candidate_places = all_places

    # Generate Detailed Day-by-Day Itinerary (3 to 4 spots per day + 3 distinct meals)
    itinerary = []
    total_places = len(candidate_places)

    slot_configs = [
        {
            'slot_number': 1,
            'slot_name': 'Morning Spotlight',
            'time': '08:30 AM - 10:45 AM',
            'badge': 'Spot 1 • Morning Exploration',
            'activity_prefix': 'Iconic morning exploration & scenic photography'
        },
        {
            'slot_number': 2,
            'slot_name': 'Mid-Day Cultural Visit',
            'time': '11:15 AM - 01:00 PM',
            'badge': 'Spot 2 • Cultural & Heritage Stop',
            'activity_prefix': 'Architectural tour, exhibits & historical immersion'
        },
        {
            'slot_number': 3,
            'slot_name': 'Afternoon Scenic Leisure',
            'time': '03:00 PM - 05:00 PM',
            'badge': 'Spot 3 • Afternoon Leisure & Nature',
            'activity_prefix': 'Lush garden strolling, craft shopping & boat rides'
        },
        {
            'slot_number': 4,
            'slot_name': 'Golden Hour Sunset Finale',
            'time': '05:30 PM - 07:30 PM',
            'badge': 'Spot 4 • Sunset View & Twilight Leisure',
            'activity_prefix': 'Breathtaking twilight vista, light show & evening breeze'
        }
    ]

    # Budget Calculation & Breakdown
    if budget == 'budget':
        daily_rate = 1600
        base_stay = 800
        base_food = 450
        base_sightseeing = 150
        base_transit = 200
        budget_breakdown = {
            'stay_per_day': '₹800',
            'food_per_day': '₹450',
            'sightseeing_per_day': '₹150',
            'transit_per_day': '₹200',
            'recommended_stay_tier': 'Budget Lodges / Backpacker Hostels / Homestays',
            'recommended_transit': 'Public Bus / City Metro / Shared Auto'
        }
    elif budget == 'luxury':
        daily_rate = 8500
        base_stay = 5200
        base_food = 2100
        base_sightseeing = 500
        base_transit = 700
        budget_breakdown = {
            'stay_per_day': '₹5,200',
            'food_per_day': '₹2,100',
            'sightseeing_per_day': '₹500',
            'transit_per_day': '₹700',
            'recommended_stay_tier': '5-Star Luxury Resorts / Heritage Palaces & Suites',
            'recommended_transit': 'Private Chauffeur Sedan / Premium Luxury SUV'
        }
    else: # moderate
        daily_rate = 3800
        base_stay = 2100
        base_food = 1000
        base_sightseeing = 300
        base_transit = 400
        budget_breakdown = {
            'stay_per_day': '₹2,100',
            'food_per_day': '₹1,000',
            'sightseeing_per_day': '₹300',
            'transit_per_day': '₹400',
            'recommended_stay_tier': 'Comfort 3-Star Hotels / Boutique Nature Stays',
            'recommended_transit': 'App Cabs / Self-Drive Rentals / Dedicated Taxis'
        }

    for day_num in range(1, days + 1):
        # 1. Distinct Restaurant for Breakfast
        breakfast_spot = breakfast_restaurants[(day_num - 1) % len(breakfast_restaurants)] if breakfast_restaurants else None

        # 2. Distinct Restaurant for Lunch
        lunch_spot = lunch_restaurants[(day_num - 1) % len(lunch_restaurants)] if lunch_restaurants else None

        # 3. Distinct Restaurant for Dinner
        dinner_spot = dinner_restaurants[(day_num - 1) % len(dinner_restaurants)] if dinner_restaurants else None

        # Curate 4 distinct tourist spots for this day
        day_spots = []
        for s_idx, cfg in enumerate(slot_configs):
            place_index = ((day_num - 1) * 4 + s_idx) % total_places if total_places > 0 else 0
            place = candidate_places[place_index] if total_places > 0 else None

            # Generate insightful tip based on category
            tip = "Arrive promptly to avoid queues and enjoy the best ambient lighting for photography."
            if place:
                cat = place.get('category_slug', '')
                if cat == 'temple':
                    tip = "Dress traditionally and observe temple customs; morning and evening pooja timings are magical."
                elif cat == 'nature':
                    tip = "Carry comfortable walking shoes and light jackets for mountain and forest breezes."
                elif cat == 'museum':
                    tip = "Take advantage of guided audio exhibits; photography tickets may be purchased at entry."
                elif cat == 'beach':
                    tip = "Enjoy cooling ocean winds and famous local sundal; avoid deep ocean swimming during high tide."
                elif cat == 'adventure':
                    tip = "Prioritize forest passes and 4x4 jeep departures early in the day for peak wildlife sightings."
                elif cat == 'historical':
                    tip = "Spend time inspecting the intricate stone pillars and royal stucco ceilings."

            day_spots.append({
                'spot_number': cfg['slot_number'],
                'slot_name': cfg['slot_name'],
                'badge': cfg['badge'],
                'time': cfg['time'],
                'place': place,
                'activity': f"{cfg['activity_prefix']} at {place['name'] if place else 'Landmark'}",
                'tip': tip
            })

        # Calculate daily sightseeing entry fee total for today's 4 spots
        day_actual_entry_fees = 0
        for s in day_spots:
            p = s.get('place')
            if p and isinstance(p.get('entry_fee'), (int, float)):
                day_actual_entry_fees += int(p.get('entry_fee', 0))

        day_sightseeing_est = max(base_sightseeing, day_actual_entry_fees)
        day_total_cost = base_stay + base_food + base_transit + day_sightseeing_est

        day_cost_breakdown = {
            'stay': f"₹{base_stay:,}",
            'food': f"₹{base_food:,}",
            'sightseeing': f"₹{day_sightseeing_est:,}",
            'transit': f"₹{base_transit:,}",
            'actual_entry_fees': f"₹{day_actual_entry_fees:,}",
            'total': f"₹{day_total_cost:,}"
        }

        # Stay & Transport Add-ons tailored to budget
        suggested_stay = matched_hotels[(day_num - 1) % len(matched_hotels)] if matched_hotels else (hotels[0] if hotels else None)
        fuel_station = petrol_bunks[(day_num - 1) % len(petrol_bunks)] if petrol_bunks else None
        emergency_hospital = hospitals[(day_num - 1) % len(hospitals)] if hospitals else None
        police_contact = police_list[0] if police_list else None

        day_plan = {
            'day': day_num,
            'title': f"Day {day_num}: Curated Highlights & Cultural Wonders of {city['name']}",
            'expected_amount_day': f"₹{day_total_cost:,}",
            'day_amount_numeric': day_total_cost,
            'day_cost_breakdown': day_cost_breakdown,
            'estimated_travel_km': round(11.0 + (day_num * 2.5), 1),
            'spots_count': len(day_spots),
            'spots': day_spots,
            # Dedicated 3 meals
            'meals': {
                'breakfast': {
                    'time': '07:30 AM - 09:00 AM',
                    'meal_type': 'Breakfast',
                    'restaurant': breakfast_spot,
                    'recommendation': 'Authentic morning filter kaapi, warm ghee roasts, fresh bakes or healthy tiffins'
                },
                'lunch': {
                    'time': '01:00 PM - 02:30 PM',
                    'meal_type': 'Lunch',
                    'restaurant': lunch_spot,
                    'recommendation': 'Traditional banana leaf meals, authentic regional thalis or specialty biryanis'
                },
                'dinner': {
                    'time': '08:00 PM - 10:00 PM',
                    'meal_type': 'Dinner',
                    'restaurant': dinner_spot,
                    'recommendation': 'Rooftop dining, candle-lit courtyard grills, sunset terrace dinner or fine dining'
                }
            },
            # Backward-compatible fields
            'morning': {
                'time': day_spots[0]['time'],
                'activity': day_spots[0]['activity'],
                'place': day_spots[0]['place'],
                'tips': day_spots[0]['tip']
            },
            'afternoon': {
                'time': '01:00 PM - 03:00 PM',
                'lunch': lunch_spot,
                'activity': 'Authentic Regional Dining & Cultural Walk',
                'highlight': day_spots[2]['place'] if len(day_spots) > 2 else None
            },
            'evening': {
                'time': day_spots[3]['time'] if len(day_spots) > 3 else '05:30 PM - 07:30 PM',
                'activity': day_spots[3]['activity'] if len(day_spots) > 3 else 'Evening Sunset',
                'place': day_spots[3]['place'] if len(day_spots) > 3 else None,
                'tips': day_spots[3]['tip'] if len(day_spots) > 3 else 'Enjoy the evening breeze'
            },
            'suggested_hotel': suggested_stay,
            'nearest_petrol': fuel_station,
            'nearest_hospital': emergency_hospital,
            'police_assistance': police_contact
        }
        itinerary.append(day_plan)

    total_budget_num = sum(d['day_amount_numeric'] for d in itinerary) if itinerary else (days * daily_rate)
    total_budget_str = f"₹{total_budget_num:,}"

    # Save to DB if user is logged in
    if user_id:
        db_conn = None
        try:
            parsed_user_id = int(user_id)
            db_conn = get_db_connection()
            db_cursor = db_conn.cursor()
            db_cursor.execute("SELECT id FROM users WHERE id = ?", (parsed_user_id,))
            if db_cursor.fetchone():
                db_cursor.execute('''
                INSERT INTO trip_plans (user_id, city_id, title, days, budget, interests_json, itinerary_json)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    parsed_user_id, city_id, f"{days}-Day {city['name']} Smart Exploration",
                    days, budget, json.dumps(interests), json.dumps(itinerary)
                ))
                db_conn.commit()
        except Exception as e:
            print("Notice: Error saving trip plan to DB:", e)
        finally:
            if db_conn:
                db_conn.close()

    return jsonify({
        'city': city,
        'days': days,
        'budget': budget,
        'daily_rate': daily_rate,
        'total_estimated_budget': total_budget_str,
        'budget_breakdown': budget_breakdown,
        'spots_per_day': 4,
        'itinerary': itinerary
    })
