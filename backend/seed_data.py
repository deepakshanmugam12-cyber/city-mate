import json
import sqlite3
import sys
import os

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

try:
    from werkzeug.security import generate_password_hash
except ImportError:
    import hashlib
    def generate_password_hash(password):
        salt = "citymate_salt_"
        return "sha256$" + hashlib.sha256((salt + password).encode('utf-8')).hexdigest()

from database import get_db_connection, init_db
from data_places import PLACES_LIST
from data_services import SERVICES_LIST

def seed_database(force=False):
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if already seeded with full dataset (144 places across 12 locations)
    cursor.execute("SELECT COUNT(*) FROM tourist_places")
    existing_places_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM services")
    existing_services_count = cursor.fetchone()[0]

    if not force and existing_places_count >= 168 and existing_services_count >= 260:
        print(f"Database already contains {existing_places_count} tourist places and {existing_services_count} services. Skipping re-seed.")
        conn.close()
        return

    print("Populating database with full comprehensive dataset (168 attractions & 264 services across 12 destinations)...")

    # Clean existing data if refreshing
    cursor.execute("DELETE FROM favorites")
    cursor.execute("DELETE FROM reviews")
    cursor.execute("DELETE FROM services")
    cursor.execute("DELETE FROM tourist_places")
    cursor.execute("DELETE FROM categories")
    cursor.execute("DELETE FROM cities")
    cursor.execute("DELETE FROM users")
    try:
        cursor.execute("DELETE FROM sqlite_sequence")
    except Exception:
        pass

    # 1. Users
    users_data = [
        ("System Admin", "admin@citymate.com", "9876543210", generate_password_hash("admin123"), "admin", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", 1),
        ("Arun Kumar", "demo@citymate.com", "9845123456", generate_password_hash("demo123"), "user", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150", 1),
        ("Priya Sharma", "priya@citymate.com", "9789012345", generate_password_hash("priya123"), "user", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", 1)
    ]
    cursor.executemany('''
    INSERT INTO users (full_name, email, phone, password_hash, role, profile_pic, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', users_data)

    # 2. Categories
    categories_data = [
        ("Nature", "trees", "nature", "Lush gardens, waterfalls, scenic hills and tranquil sanctuaries"),
        ("Historical", "landmark", "historical", "Ancient monuments, palaces, forts, and colonial relics"),
        ("Adventure", "compass", "adventure", "Trekking trails, wild safari, ziplining and thrill pursuits"),
        ("Beach", "umbrella-beach", "beach", "Sunny coastlines, promenades, water sports and sunsets"),
        ("Temple", "om", "temple", "Spiritual architecture, sacred shrines and historic sanctums"),
        ("Museum", "building-columns", "museum", "Cultural collections, art galleries and science exhibits"),
        ("Shopping", "bag-shopping", "shopping", "Vibrant craft bazaars, textile markets and modern shopping plazas"),
        ("Entertainment", "film", "entertainment", "Theme parks, live cinemas, entertainment arenas and fun centers"),
        ("Rural & Village", "wheat-awn", "rural", "Authentic countryside hamlets, organic farms, pottery villages, weavers colonies, and agro-tourism trails")
    ]
    cursor.executemany('''
    INSERT INTO categories (name, icon, slug, description)
    VALUES (?, ?, ?, ?)
    ''', categories_data)

    # 3. Cities (12 Iconic Tourist Destinations)
    cities_data = [
        ("Coimbatore", "Tamil Nadu", "India", 11.0168, 76.9558, "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800", "The Manchester of South India, blessed with cool Nilgiri breezes, spiritual landmarks, and vibrant engineering.", 1),
        ("Chennai", "Tamil Nadu", "India", 13.0827, 80.2707, "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800", "Gateway to the South, famed for Marina Beach, Dravidian temples, rich Carnatic music, and sea breezes.", 1),
        ("Ooty", "Tamil Nadu", "India", 11.4102, 76.6950, "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800", "Queen of Hill Stations with rolling tea estates, cool misty mountains, and heritage toy train rides.", 1),
        ("Madurai", "Tamil Nadu", "India", 9.9252, 78.1198, "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800", "The Cultural Capital of Tamil Nadu, celebrated for the towering Meenakshi Amman Temple and midnight food streets.", 1),
        ("Salem", "Tamil Nadu", "India", 11.6643, 78.1460, "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800", "Surrounded by emerald hills, silver jewelry craft, sweet mango orchards, and the serene heights of Yercaud.", 1),
        ("Bengaluru", "Karnataka", "India", 12.9716, 77.5946, "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800", "India's Silicon Valley and Garden City, home to sprawling parks, craft microbreweries, and grand palaces.", 1),
        ("Kodaikanal", "Tamil Nadu", "India", 10.2381, 77.4892, "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=800", "Princess of Hill Stations, crowned by serene Kodai lake, misty cliffside paths, cascading waterfalls, and fragrant pine valleys.", 1),
        ("Pondicherry", "Puducherry", "India", 11.9416, 79.8083, "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800", "The French Riviera of the East, famed for French colonial boulevards, pastel villas, Auroville, peaceful beaches, and seaside cafes.", 1),
        ("Kanyakumari", "Tamil Nadu", "India", 8.0883, 77.5385, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800", "The southernmost tip of mainland India where the three oceans meet, famed for the Vivekananda Rock Memorial and sunrise vistas.", 1),
        ("Thanjavur", "Tamil Nadu", "India", 10.7870, 79.1378, "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800", "The historical capital of the Great Living Chola Empire, celebrated for the colossal Brihadeeswara Big Temple and Saraswathi Mahal Library.", 1),
        ("Mysuru", "Karnataka", "India", 12.2958, 76.6394, "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800", "The Royal City of Palaces, famed for the grand illuminated Amba Vilas Palace, Chamundi Hills, sandalwood, and silk.", 1),
        ("Munnar", "Kerala", "India", 10.0889, 77.0595, "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800", "Verdant jewel of God's Own Country nestled amidst sprawling emerald tea plantations, rolling clouds, waterfalls, and wildlife.", 1)
    ]
    cursor.executemany('''
    INSERT INTO cities (name, state, country, lat, lng, image_url, description, popular)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', cities_data)

    # Fetch City & Category maps
    cursor.execute("SELECT id, name FROM cities")
    city_map = {name: id for id, name in cursor.fetchall()}
    cursor.execute("SELECT id, slug FROM categories")
    cat_map = {slug: id for id, slug in cursor.fetchall()}

    # 4. Tourist Places (144 Curated Places Across 12 Locations)
    formatted_places = []
    for item in PLACES_LIST:
        city_name, cat_slug, name, desc, addr, lat, lng, img, gal, rating, rev_count, fee, hours, best_t, dist, tags, feat = item
        formatted_places.append((
            city_map[city_name],
            cat_map[cat_slug],
            name, desc, addr, lat, lng, img,
            json.dumps(gal),
            rating, rev_count, fee, hours, best_t, dist,
            json.dumps(tags),
            feat
        ))

    cursor.executemany('''
    INSERT INTO tourist_places (
        city_id, category_id, name, description, address, lat, lng,
        image_url, gallery_json, rating, review_count, entry_fee,
        opening_hours, best_time, distance_km, tags_json, is_featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', formatted_places)

    # Build place name to ID map
    cursor.execute("SELECT id, name FROM tourist_places")
    place_name_to_id = {name: id for id, name in cursor.fetchall()}

    # 5. Services (264 Curated Services Across 12 Locations)
    formatted_services = []
    for item in SERVICES_LIST:
        city_name, linked_place, s_type, name, addr, lat, lng, rating, phone, op_status, img, dist, price = item
        p_id = place_name_to_id.get(linked_place) if linked_place else None
        formatted_services.append((
            city_map[city_name],
            p_id,
            s_type,
            name, addr, lat, lng, rating, phone, op_status, img, dist, price
        ))

    cursor.executemany('''
    INSERT INTO services (
        city_id, place_id, service_type, name, address, lat, lng,
        rating, phone, opening_status, image_url, distance_km, price_level
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', formatted_services)

    # 6. Reviews
    # Fetch a few famous place IDs
    adiyogi_id = place_name_to_id.get("Adiyogi Shiva & Isha Yoga Center", 1)
    marina_id = place_name_to_id.get("Marina Beach & Promenade", 13)
    ooty_bot_id = place_name_to_id.get("Government Botanical Garden", 25)
    meenakshi_id = place_name_to_id.get("Meenakshi Amman Temple", 37)
    lalbagh_id = place_name_to_id.get("Lalbagh Botanical Gardens & Glass House", 61)
    kodai_id = place_name_to_id.get("Kodaikanal Lake & Star-Shaped Promenade", 73)
    promenade_id = place_name_to_id.get("Promenade Beach & Goubert Avenue", 85)
    vivekananda_id = place_name_to_id.get("Vivekananda Rock Memorial & Ferry", 97)
    brihadeeswara_id = place_name_to_id.get("Brihadeeswara Temple (Big Temple)", 109)
    mysore_palace_id = place_name_to_id.get("Mysore Royal Palace (Amba Vilas)", 121)
    eravikulam_id = place_name_to_id.get("Eravikulam National Park & Nilgiri Tahr", 133)

    reviews_data = [
        (adiyogi_id, 2, 5, "Mesmerizing experience at sunset! The 3D laser sound and light show projected on the Adiyogi statue gave us goosebumps. The mountain serenity is unmatched.", "Arun Kumar"),
        (adiyogi_id, 3, 5, "Very peaceful and clean ambiance. Make sure to visit the Surya Kund and Dhyanalinga for deep silent meditation.", "Priya Sharma"),
        (marina_id, 2, 5, "Walking along Marina beach in the early morning breeze while watching the sunrise was the highlight of our Chennai trip. Plenty of clean pathways.", "Arun Kumar"),
        (ooty_bot_id, 3, 5, "Fabulous variety of flowers and trees. Even in peak season, the terraced lawn offers a peaceful retreat. Highly recommended for families!", "Priya Sharma"),
        (meenakshi_id, 2, 5, "The Hall of Thousand Pillars and towering gopurams are magnificent. Don't miss the famous Murugan Idli right across the tower!", "Arun Kumar"),
        (lalbagh_id, 2, 5, "Pure botanical serenity right in the heart of Bengaluru. The Glass House and old bonsai gardens are spectacular. Don't forget breakfast at MTR next door!", "Arun Kumar"),
        (kodai_id, 2, 5, "Pedaling through the mist across Kodaikanal lake in early morning is an unforgettable mountain memory.", "Arun Kumar"),
        (promenade_id, 3, 5, "Promenade beach in Pondicherry during golden hour is magical. White Town's French cafes right across the street are wonderful.", "Priya Sharma"),
        (vivekananda_id, 2, 5, "The ferry ride over the three roaring oceans to reach the Vivekananda rock memorial was thrilling and spiritually uplifting.", "Arun Kumar"),
        (brihadeeswara_id, 3, 5, "The Big Temple in Thanjavur is breathtaking. Standing beneath the 216-foot granite Vimana leaves you in awe of Chola architecture.", "Priya Sharma"),
        (mysore_palace_id, 2, 5, "When the 97,000 bulbs light up Mysore Palace on Sunday evening, the view is pure royalty! A must-see in South India.", "Arun Kumar"),
        (eravikulam_id, 3, 5, "Spotting Nilgiri Tahrs grazing peacefully amidst the rolling misty tea hills of Munnar was the highlight of our Kerala holiday.", "Priya Sharma")
    ]
    cursor.executemany('''
    INSERT INTO reviews (place_id, user_id, rating, comment, user_name)
    VALUES (?, ?, ?, ?, ?)
    ''', reviews_data)

    # 7. Favorites
    favorites_data = [
        (2, adiyogi_id),
        (2, ooty_bot_id),
        (3, marina_id),
        (2, kodai_id),
        (3, promenade_id),
        (2, brihadeeswara_id)
    ]
    cursor.executemany('''
    INSERT INTO favorites (user_id, place_id)
    VALUES (?, ?)
    ''', favorites_data)

    # 8. Feedback
    feedback_data = [
        (2, "Arun Kumar", "arun.traveler@example.com", "General Experience", 5, "Game changer for South India road trips!", "CityMate is an absolute game-changer! The smart trip planner prepared our entire 3-day Ooty & Nilgiris vacation in under 10 seconds with breakfast, lunch, and dinner recommendations. Saved us hours of research!", "⚡ Super Fast, 🗺️ Smart Planner", "Reviewed"),
        (3, "Priya Sharma", "priya.sharma@example.com", "Emergency & Services", 5, "Emergency hospital finder is a lifesaver", "The emergency hospitals and 24/7 services locator gave our family huge peace of mind while exploring Coimbatore and Munnar. The distance calculations and contact numbers were spot on.", "📍 Accurate Info, 🏥 Safe Travel", "Reviewed"),
        (None, "David Miller", "david.m@globetrotter.io", "App Experience", 5, "Stunning UI and authentic local insights", "Clean, responsive, and gorgeous modern interface. Having accurate ticket fees, timings, and high-res photos before arriving at temples and monuments made our vacation effortless.", "🎨 Beautiful UI, 🌟 Helpful Guides", "Reviewed"),
        (None, "Ananya Ramesh", "ananya.r@outlook.com", "Feature Request", 5, "Loved the 3-4 spots per day planner!", "The daily itinerary sequencing from morning sunrise to golden hour sunset with dedicated breakfast, lunch, and dinner spots was exactly what we needed for our family trip.", "💡 Smart Planner, 🍽️ Dining Curation", "Reviewed"),
        (2, "Karthik Venkatesh", "karthik.v@techie.in", "General Experience", 5, "Top-tier tourist companion", "One of the best tourism companion apps I have ever used. Fast loading, no clutter, and the interactive map helped us locate nearby eateries right after sightseeing.", "⚡ Fast & Smooth, 📱 Mobile Friendly", "Reviewed")
    ]
    cursor.executemany('''
    INSERT INTO feedbacks (user_id, name, email, feedback_type, rating, subject, message, tags, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', feedback_data)

    # 9. Bookings (Pre-seed confirmed booking details for traveler Arun Kumar)
    bookings_data = [
        ("CM-AY9821", adiyogi_id, 2, "Arun Kumar", "demo@citymate.com", "+91 98451 23456", "2026-10-25", "10:00 AM", 2, 1, 0.0, "Wheelchair assistance needed at Dhyanalinga entrance", "confirmed"),
        ("CM-GD5412", gedee_car_id if 'gedee_car_id' in locals() else 4, 2, "Arun Kumar", "demo@citymate.com", "+91 98451 23456", "2026-10-27", "02:30 PM", 2, 0, 200.0, "Guided tour reservation for classic British motorcars", "confirmed")
    ]
    cursor.executemany('''
    INSERT INTO bookings (booking_ref, place_id, user_id, visitor_name, visitor_email, visitor_phone, visit_date, visit_time, num_adults, num_children, total_amount, special_requests, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', bookings_data)

    conn.commit()
    conn.close()
    print("Database successfully seeded with 168 tourist attractions, 264 services, and sample bookings!")

    # Export to frontend/js/data.js
    export_to_frontend_data_js()

def export_to_frontend_data_js():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM cities ORDER BY id")
    cities = [dict(r) for r in cursor.fetchall()]

    cursor.execute('''
    SELECT p.*, c.name as city_name, cat.name as category_name, cat.slug as category_slug
    FROM tourist_places p
    JOIN cities c ON p.city_id = c.id
    JOIN categories cat ON p.category_id = cat.id
    ORDER BY p.id
    ''')
    places = []
    for r in cursor.fetchall():
        d = dict(r)
        d['gallery'] = json.loads(d.get('gallery_json') or '[]')
        d['tags'] = json.loads(d.get('tags_json') or '[]')
        places.append(d)

    cursor.execute('''
    SELECT s.*, c.name as city_name
    FROM services s
    JOIN cities c ON s.city_id = c.id
    ORDER BY s.id
    ''')
    services = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM categories ORDER BY id")
    categories = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT id, full_name, email, phone, role, profile_pic, is_active FROM users ORDER BY id")
    users = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM reviews ORDER BY id")
    reviews = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM feedbacks ORDER BY id")
    feedbacks = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT place_id FROM favorites WHERE user_id = 2")
    favorites = [r['place_id'] for r in cursor.fetchall()]
    if not favorites:
        favorites = [1, 2, 4]

    cursor.execute('''
    SELECT b.*, p.name as place_name, p.image_url, p.address, c.name as city_name 
    FROM bookings b 
    JOIN tourist_places p ON b.place_id = p.id 
    JOIN cities c ON p.city_id = c.id 
    ORDER BY b.id DESC
    ''')
    bookings = [dict(r) for r in cursor.fetchall()]

    conn.close()

    # Update cities places_count and services_count
    for c in cities:
        c['places_count'] = len([p for p in places if p['city_id'] == c['id']])
        c['services_count'] = len([s for s in services if s['city_id'] == c['id']])

    js_file_path = os.path.join(PROJECT_ROOT, 'frontend', 'js', 'data.js')
    with open(js_file_path, 'w', encoding='utf-8') as f:
        f.write("/**\n * CityMate Rich Seed Data\n * Provides complete data for offline mode or instant frontend preview,\n * mirrored with the SQLite backend schema.\n */\n\n")
        f.write("const SEED_DATA = ")
        json.dump({
            'cities': cities,
            'categories': categories,
            'places': places,
            'services': services,
            'reviews': reviews,
            'feedbacks': feedbacks,
            'users': users,
            'favorites': favorites,
            'bookings': bookings
        }, f, indent=2, ensure_ascii=False)
        f.write(";\n\n")
        f.write("if (typeof window !== 'undefined') {\n  window.SEED_DATA = SEED_DATA;\n}\n\n")
        f.write("if (typeof module !== 'undefined' && module.exports) {\n  module.exports = SEED_DATA;\n}\n")

    print(f"Exported {len(places)} places, {len(services)} services, {len(reviews)} reviews to frontend/js/data.js")

if __name__ == '__main__':
    force_seed = '--force' in sys.argv
    seed_database(force=force_seed)
