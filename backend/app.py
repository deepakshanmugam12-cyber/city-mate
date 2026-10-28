import os
import sys

# Ensure current and parent dirs are on path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
sys.path.insert(0, CURRENT_DIR)
sys.path.insert(0, PROJECT_ROOT)

from flask import Flask, send_from_directory, jsonify, request, make_response, g, redirect
from flask_cors import CORS
from database import init_db
from seed_data import seed_database
from auth import requires_auth, requires_admin, optional_auth, AUTH_REALM, unauthorized_response, forbidden_response
from routes import (
    auth_bp,
    places_bp,
    services_bp,
    reviews_bp,
    favorites_bp,
    recommendations_bp,
    planner_bp,
    admin_bp,
    feedback_bp,
    bookings_bp
)

FRONTEND_DIR = os.path.join(PROJECT_ROOT, 'frontend')

app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path='')
CORS(app, expose_headers=['WWW-Authenticate', 'Authorization'])

# Register Blueprints under /api and /auth
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(auth_bp, url_prefix='/auth', name='auth_alt')
app.register_blueprint(places_bp, url_prefix='/api')
app.register_blueprint(services_bp, url_prefix='/api')
app.register_blueprint(reviews_bp, url_prefix='/api')
app.register_blueprint(favorites_bp, url_prefix='/api')
app.register_blueprint(recommendations_bp, url_prefix='/api')
app.register_blueprint(planner_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')
app.register_blueprint(feedback_bp, url_prefix='/api')
app.register_blueprint(bookings_bp, url_prefix='/api')

# ========================================================
# Security Headers Middleware
# ========================================================
@app.after_request
def add_security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    return response

# ========================================================
# Standardized Error Handlers
# ========================================================
@app.errorhandler(401)
def handle_401(e):
    return unauthorized_response("Valid CityMate credentials are required.")

@app.errorhandler(403)
def handle_403(e):
    return forbidden_response("You do not have permission to access this resource.")

@app.errorhandler(404)
def handle_404(e):
    accept_header = request.headers.get('Accept', '')
    if 'text/html' in accept_header and not request.path.startswith('/api/'):
        return send_from_directory(FRONTEND_DIR, 'index.html')
    return make_response(jsonify({
        "error": "Not Found",
        "message": "The requested CityMate resource was not found."
    }), 404)

# ========================================================
# Public Routes
# ========================================================
import json
import urllib.request
import urllib.error
import math

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'application': 'CITYMATE – Smart Tourist Companion',
        'version': '1.0.0',
        'authentication': 'HTTP Basic Auth (RFC 7235)'
    })

@app.route('/api/route', methods=['GET'])
def get_route():
    """Proxy route to OSRM with local fallback for exact navigation."""
    try:
        start_lat = float(request.args.get('start_lat', 0))
        start_lng = float(request.args.get('start_lng', 0))
        dest_lat = float(request.args.get('dest_lat', 0))
        dest_lng = float(request.args.get('dest_lng', 0))
        mode = request.args.get('mode', 'driving')
        
        if not (start_lat and start_lng and dest_lat and dest_lng):
            return jsonify({'error': 'Missing coordinates'}), 400
            
        osrm_mode = 'driving' if mode == 'driving' else ('foot' if mode == 'walking' else 'bike')
        url_https = f"https://router.project-osrm.org/route/v1/{osrm_mode}/{start_lng},{start_lat};{dest_lng},{dest_lat}?overview=full&geometries=geojson&steps=true"
        url_http = f"http://router.project-osrm.org/route/v1/{osrm_mode}/{start_lng},{start_lat};{dest_lng},{dest_lat}?overview=full&geometries=geojson&steps=true"
        
        for target_url in [url_https, url_http]:
            try:
                req = urllib.request.Request(target_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CityMate/1.0'})
                with urllib.request.urlopen(req, timeout=10) as response:
                    if response.status == 200:
                        data = json.loads(response.read().decode('utf-8'))
                        if data.get('code') == 'Ok' and data.get('routes'):
                            return jsonify(data)
            except Exception as req_err:
                print(f"OSRM request error ({target_url}):", req_err)
                continue
    except Exception as e:
        print("Backend route error:", e)
        return jsonify({'error': str(e), 'code': 'RouteError'}), 500
    
    # Requirement: Do not use straight-line distance as road distance. Return appropriate error when route cannot be found.
    return jsonify({
        'error': 'No road route could be found between the selected coordinates.',
        'code': 'NoRoute'
    }), 404

@app.route('/login-info', methods=['GET'])
@optional_auth
def login_info_page():
    """Public informational page explaining HTTP Basic Authentication."""
    login_info_file = os.path.join(FRONTEND_DIR, 'login-info.html')
    if os.path.exists(login_info_file):
        return send_from_directory(FRONTEND_DIR, 'login-info.html')
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/login', methods=['GET'])
def login_page():
    """Dedicated modern CityMate login page."""
    login_file = os.path.join(FRONTEND_DIR, 'login.html')
    if os.path.exists(login_file):
        return send_from_directory(FRONTEND_DIR, 'login.html')
    return send_from_directory(FRONTEND_DIR, 'index.html')

# ========================================================
# Protected Page Routes (Require HTTP Basic Authentication)
# ========================================================
@app.route('/dashboard', methods=['GET'])
@requires_auth(role='user')
def protected_dashboard():
    """Protected user dashboard page."""
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/profile', methods=['GET'])
@requires_auth(role='user')
def protected_profile():
    """Protected user profile page."""
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/favorites', methods=['GET'])
@requires_auth(role='user')
def protected_favorites():
    """Protected wishlist favorites page."""
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/recommendations', methods=['GET'])
@requires_auth(role='user')
def protected_recommendations():
    """Protected personalized recommendations page."""
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/trip-planner', methods=['GET'])
@requires_auth(role='user')
def protected_planner():
    """Protected trip planner page."""
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/admin', methods=['GET'])
@requires_admin
def protected_admin():
    """Protected admin dashboard page (Admin role only)."""
    return send_from_directory(FRONTEND_DIR, 'index.html')

# ========================================================
# Static Files & Homepage Serving
# ========================================================
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
@optional_auth
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(FRONTEND_DIR, path)):
        return send_from_directory(FRONTEND_DIR, path)
    index_file = os.path.join(FRONTEND_DIR, 'index.html')
    if os.path.exists(index_file):
        return send_from_directory(FRONTEND_DIR, 'index.html')
    return jsonify({
        'message': 'CityMate Flask REST API operational with HTTP Basic Authentication.'
    })

def setup_application():
    try:
        init_db()
        seed_database()
        print("CityMate Database and Seed Data ready.")
    except Exception as e:
        print("Database setup notice:", e)

if __name__ == '__main__':
    setup_application()
    port = int(os.environ.get('PORT', 5000))
    print(f"\n=======================================================")
    print(f"  CITYMATE – HTTP Basic Authentication Server Running")
    print(f"  Local URL: http://127.0.0.1:{port}")
    print(f"  Auth Info: http://127.0.0.1:{port}/login-info")
    print(f"  Admin Dashboard: http://127.0.0.1:{port}/admin")
    print(f"=======================================================\n")
    app.run(host='0.0.0.0', port=port, debug=True)
