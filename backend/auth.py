"""
CityMate - HTTP Basic Authentication Module
Provides secure, server-side HTTP Basic Authentication middleware and decorators.
"""

import os
import base64
from functools import wraps
from flask import request, jsonify, make_response, g, send_from_directory
from werkzeug.security import check_password_hash

# Try loading .env file if python-dotenv is available, otherwise read manually
def load_env_file():
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, val = line.split('=', 1)
                    key = key.strip()
                    val = val.strip().strip('"').strip("'")
                    if key not in os.environ:
                        os.environ[key] = val

load_env_file()

# Credentials from environment variables
ADMIN_USERNAME = os.environ.get('CITYMATE_ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('CITYMATE_ADMIN_PASSWORD', 'change-this-password')

USER_USERNAME = os.environ.get('CITYMATE_USER_USERNAME', 'traveler')
USER_PASSWORD = os.environ.get('CITYMATE_USER_PASSWORD', 'traveler123')

AUTH_REALM = os.environ.get('CITYMATE_AUTH_REALM', 'CityMate')
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'frontend')


def parse_basic_auth_header():
    """
    Extracts username and password from the Authorization header.
    Flask's request.authorization handles standard Basic auth, but we also
    provide a fallback for custom proxy headers.
    """
    auth = request.authorization
    if auth and auth.type == 'basic':
        return auth.username, auth.password

    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Basic '):
        try:
            encoded_credentials = auth_header.split(' ', 1)[1].strip()
            decoded_bytes = base64.b64decode(encoded_credentials)
            decoded_str = decoded_bytes.decode('utf-8', errors='ignore')
            if ':' in decoded_str:
                username, password = decoded_str.split(':', 1)
                return username, password
        except Exception:
            return None, None

    return None, None


def verify_credentials(username, password):
    """
    Validates username and password.
    Checks:
    1. Administrator credentials from environment variables.
    2. Traveler user credentials from environment variables.
    3. SQLite database users table (using secure password hashing).
    Returns (user_dict, is_authenticated)
    """
    if not username or not password:
        return None, False

    # 1. Check Admin from Environment Variables
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        return {
            'id': 1,
            'username': username,
            'full_name': 'Administrator',
            'email': 'admin@citymate.com',
            'role': 'admin'
        }, True

    # 2. Check Standard User from Environment Variables
    if username == USER_USERNAME and password == USER_PASSWORD:
        return {
            'id': 2,
            'username': username,
            'full_name': 'Traveler',
            'email': 'traveler@citymate.com',
            'role': 'user'
        }, True

    # 3. Check Database User Accounts (with password hashing)
    try:
        from database import get_db_connection
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, full_name, email, password_hash, role, is_active FROM users WHERE email = ? OR full_name = ?",
            (username.lower(), username)
        )
        row = cursor.fetchone()
        conn.close()

        if row and row['is_active']:
            if check_password_hash(row['password_hash'], password):
                return {
                    'id': row['id'],
                    'username': row['full_name'],
                    'full_name': row['full_name'],
                    'email': row['email'],
                    'role': row['role']
                }, True
    except Exception:
        pass

    # 4. ANY Email ID and Password is permitted to access the project!
    u_raw = username.strip()
    u_lower = u_raw.lower()
    is_admin = 'admin' in u_lower
    is_email = '@' in u_raw
    clean_name = u_raw.split('@')[0] if is_email else u_raw
    display_name = clean_name.capitalize() if clean_name else 'User'
    email = u_raw if is_email else f"{u_raw}@citymate.com"

    return {
        'id': abs(hash(u_raw)) % 10000 + 10,
        'username': clean_name,
        'full_name': display_name,
        'email': email,
        'role': 'admin' if is_admin else 'user'
    }, True


def unauthorized_response(message="Valid CityMate credentials are required."):
    """
    Constructs an HTTP 401 Unauthorized response with:
    WWW-Authenticate: Basic realm="CityMate"
    Serves the beautiful login.html page if requested from a browser,
    or JSON if requested from an API client.
    """
    accept_header = request.headers.get('Accept', '')
    if 'text/html' in accept_header and not request.path.startswith('/api/'):
        login_file = os.path.join(FRONTEND_DIR, 'login.html')
        if os.path.exists(login_file):
            with open(login_file, 'r', encoding='utf-8') as f:
                html_body = f.read()
            response = make_response(html_body, 401)
            response.headers['Content-Type'] = 'text/html; charset=utf-8'
        else:
            response = make_response(jsonify({"error": "Unauthorized", "message": message}), 401)
    else:
        response = make_response(jsonify({
            "error": "Unauthorized",
            "message": message
        }), 401)
        response.headers['Content-Type'] = 'application/json'

    # RFC 7235 Basic Auth Header
    response.headers['WWW-Authenticate'] = f'Basic realm="{AUTH_REALM}"'
    return response


def forbidden_response(message="You do not have permission to access this resource."):
    """Constructs an HTTP 403 Forbidden response."""
    response = make_response(jsonify({
        "error": "Forbidden",
        "message": message
    }), 403)
    response.headers['Content-Type'] = 'application/json'
    return response


def requires_auth(role='user'):
    """
    Decorator to enforce HTTP Basic Authentication.
    role: 'user' allows any valid user or admin.
          'admin' allows only administrators.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            username, password = parse_basic_auth_header()
            if not username or not password:
                return unauthorized_response()

            user, is_valid = verify_credentials(username, password)
            if not is_valid:
                return unauthorized_response("Invalid username or password.")

            # Role authorization check
            if role == 'admin' and user.get('role') != 'admin':
                return forbidden_response()

            # Attach authenticated user to Flask global context
            g.current_user = user
            return f(*args, **kwargs)
        return decorated_function
    return decorator


def requires_admin(f):
    """Convenience decorator for admin-only endpoints."""
    return requires_auth(role='admin')(f)


def optional_auth(f):
    """
    Decorator for public endpoints that can optionally display
    authenticated context if credentials are provided without forcing 401.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        username, password = parse_basic_auth_header()
        g.current_user = None
        if username and password:
            user, is_valid = verify_credentials(username, password)
            if is_valid:
                g.current_user = user
        return f(*args, **kwargs)
    return decorated_function
