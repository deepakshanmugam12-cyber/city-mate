import sqlite3
import os
import json

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'database')
DB_PATH = os.path.join(DB_DIR, 'citymate.db')

def get_db_connection():
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    os.makedirs(DB_DIR, exist_ok=True)
    conn = get_db_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        profile_pic TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    # Cities table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        state TEXT NOT NULL,
        country TEXT DEFAULT 'India',
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        image_url TEXT,
        description TEXT,
        popular INTEGER DEFAULT 1
    )
    ''')

    # Categories table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        icon TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT
    )
    ''')

    # Tourist Places table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tourist_places (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        address TEXT,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        image_url TEXT,
        gallery_json TEXT DEFAULT '[]',
        rating REAL DEFAULT 4.5,
        review_count INTEGER DEFAULT 0,
        entry_fee REAL DEFAULT 0,
        opening_hours TEXT,
        best_time TEXT,
        distance_km REAL DEFAULT 5.0,
        tags_json TEXT DEFAULT '[]',
        is_featured INTEGER DEFAULT 0,
        FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
    )
    ''')

    # Services table (Hotels, Restaurants, Hospitals, ATMs, Petrol, Restrooms, Markets, Rentals)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        city_id INTEGER NOT NULL,
        place_id INTEGER,
        service_type TEXT NOT NULL,
        name TEXT NOT NULL,
        address TEXT,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        rating REAL DEFAULT 4.2,
        phone TEXT,
        opening_status TEXT DEFAULT 'Open Now',
        image_url TEXT,
        distance_km REAL DEFAULT 1.2,
        price_level TEXT DEFAULT '$$',
        FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE CASCADE,
        FOREIGN KEY (place_id) REFERENCES tourist_places (id) ON DELETE SET NULL
    )
    ''')

    # Reviews table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        place_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        user_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (place_id) REFERENCES tourist_places (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
    ''')

    # Favorites table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        place_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, place_id),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (place_id) REFERENCES tourist_places (id) ON DELETE CASCADE
    )
    ''')

    # Trip Plans table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS trip_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        city_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        days INTEGER NOT NULL,
        budget TEXT,
        interests_json TEXT,
        itinerary_json TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (city_id) REFERENCES cities (id) ON DELETE CASCADE
    )
    ''')

    # App Feedback table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS feedbacks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        feedback_type TEXT NOT NULL DEFAULT 'General Feedback',
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        subject TEXT,
        message TEXT NOT NULL,
        tags TEXT DEFAULT '',
        status TEXT DEFAULT 'Pending',
        admin_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
    )
    ''')

    # Bookings table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_ref TEXT UNIQUE NOT NULL,
        place_id INTEGER NOT NULL,
        user_id INTEGER,
        visitor_name TEXT NOT NULL,
        visitor_email TEXT NOT NULL,
        visitor_phone TEXT,
        visit_date TEXT NOT NULL,
        visit_time TEXT,
        num_adults INTEGER NOT NULL DEFAULT 1,
        num_children INTEGER NOT NULL DEFAULT 0,
        total_amount REAL NOT NULL DEFAULT 0,
        special_requests TEXT,
        status TEXT NOT NULL DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (place_id) REFERENCES tourist_places (id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
    )
    ''')

    conn.commit()
    conn.close()
    print("Database initialized successfully at:", DB_PATH)

if __name__ == '__main__':
    init_db()
