# CITYMATE – Smart Tourist Companion 🌍✨
### Secure HTTP Basic Authentication Architecture

> **Tagline:** *"Explore More. Travel Smarter."*  
> CityMate is an enterprise-grade smart tourism web platform featuring genuine server-side **HTTP Basic Authentication (RFC 7235)**, environment-based credential management, role-based access control (`user` vs `admin`), and protected RESTful APIs.

---

## 🔒 HTTP Basic Authentication Architecture

CityMate implements true server-side HTTP Basic Authentication conforming to RFC 7235 standards:

```
User visits CityMate (Public Home: /)
               │
               ▼
User clicks "Sign In" or visits a protected resource (/profile, /favorites, /admin)
               │
               ▼
Backend checks "Authorization: Basic <base64>" header
               │
     ┌─────────┴─────────┐
     │                   │
[Missing / Invalid]   [Valid Credentials]
     │                   │
     ▼                   ▼
HTTP 401 Unauthorized    Check Role & Permissions
WWW-Authenticate:        │
Basic realm="CityMate"   ├─ Standard User accessing /profile -> HTTP 200 OK
     │                   ├─ Standard User accessing /admin   -> HTTP 403 Forbidden
     ▼                   └─ Admin User accessing /admin      -> HTTP 200 OK
Browser automatically displays
native Username/Password dialog
```

---

## 🔑 Development Credentials (Configured in `.env`)

The application loads credentials from the project's root `.env` file:

| Role | Username | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `change-this-password` | Full Platform Access, Admin Dashboard (`/admin`), Metrics, Moderation |
| **Standard Traveler** | `traveler` | `traveler123` | Protected Profile, Favorites (`/favorites`), Recommendations, Trip Planner |

> **Security Note:** The `.env` file is excluded from version control via `.gitignore`. Never hardcode passwords or commit production credentials.

---

## 🛡️ Production Security & Password Hashing

In development, credentials can be read from environment variables. For production user accounts, CityMate implements secure password hashing via `werkzeug.security`:

1. **Password Hashing:**
   - Passwords are never stored or logged in plain text.
   - When users register, their password is processed using a cryptographically secure salt and hash:
     ```python
     from werkzeug.security import generate_password_hash, check_password_hash
     
     # Storage
     password_hash = generate_password_hash("traveler-password", method="pbkdf2:sha256", salt_length=16)
     
     # Verification during HTTP Basic Auth
     is_valid = check_password_hash(user_record["password_hash"], submitted_password)
     ```
2. **HTTPS Requirement:**
   - HTTP Basic Authentication sends credentials Base64-encoded (`Authorization: Basic dXNlcjpwYXNz`), **not encrypted**.
   - In production, **HTTPS/TLS encryption is strictly mandatory** to prevent credential interception on public networks.
3. **Security Headers Enforced:**
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`

---

## 🚦 Route Protection Matrix

### Public Endpoints (Accessible to Anyone)
- `GET /` – CityMate homepage (Main UI)
- `GET /login-info` – HTTP Basic Auth information & status page
- `GET /api/public/places` – Public tourism destinations list
- `GET /api/health` – Server health status
- `GET /auth/status` – Live authentication status checker

### Protected Endpoints (Requires `user` or `admin` Basic Auth)
- `GET /profile` – Protected user profile
- `GET /favorites` – User saved destinations
- `GET /recommendations` – Personalized recommendations
- `GET /trip-planner` – Smart trip itinerary planner
- `GET /api/favorites` & `POST /api/favorites/toggle`
- `POST /api/reviews` – Review submission

### Admin-Only Endpoints (Requires `admin` role, 403 Forbidden for standard users)
- `GET /admin` – Protected administrative control center
- `GET /api/admin/stats` – Platform analytics & metrics
- `POST /api/places`, `PUT /api/places/<id>`, `DELETE /api/places/<id>`
- `POST /api/services`, `DELETE /api/services/<id>`
- `POST /api/admin/users/<id>/toggle-status`

---

## ⚠️ Browser Credential Caching & Logout

**Important Architectural Note:**  
RFC 7235 HTTP Basic Authentication does not have a native server-side logout command because modern browsers cache credentials in memory for the active browser process.

To completely log out:
1. Close all browser windows, **OR**
2. Clear the browser's cached credentials via your browser's Privacy & Security settings, **OR**
3. Re-authenticate by providing alternative credentials.

The `/auth/logout` endpoint and the in-app "Logout" button clearly inform the user of this standard RFC behavior.

---

## 💻 How to Run in VS Code

### Option 1: Python Flask Backend (Recommended)

1. Open the project folder in **VS Code**.
2. Open a terminal in VS Code (`Ctrl + ~` or **Terminal > New Terminal**).
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the application:
   ```bash
   python backend/app.py
   ```
   *(Or run `python app.py` from root)*
5. Open your browser:
   - **Homepage:** `http://127.0.0.1:5000/`
   - **Auth Info:** `http://127.0.0.1:5000/login-info`
   - **Admin Portal:** `http://127.0.0.1:5000/admin`

---

### Option 2: Node.js Backend Server

CityMate also includes a self-contained Node.js server with the exact same HTTP Basic Auth logic:
```bash
node server.js
```
The server will start listening at `http://127.0.0.1:5000`.

---

## 🧪 Testing with `curl` & PowerShell

### 1. Test Public Endpoint
```bash
curl -i http://localhost:5000/api/health
```
*Expected: `HTTP/1.1 200 OK`*

### 2. Test Protected Route without Credentials
```bash
curl -i http://localhost:5000/profile
```
*Expected: `HTTP/1.1 401 Unauthorized` with `WWW-Authenticate: Basic realm="CityMate"`*

### 3. Test Protected Route with Traveler Credentials
```bash
curl -i -u traveler:traveler123 http://localhost:5000/profile
```
*Expected: `HTTP/1.1 200 OK`*

### 4. Test Admin Route with Traveler Credentials (Authorization Check)
```bash
curl -i -u traveler:traveler123 http://localhost:5000/admin
```
*Expected: `HTTP/1.1 403 Forbidden` (`{"error": "Forbidden", "message": "You do not have permission to access this resource."}`)*

### 5. Test Admin Route with Admin Credentials
```bash
curl -i -u admin:change-this-password http://localhost:5000/admin
```
*Expected: `HTTP/1.1 200 OK`*

### 6. Test Invalid Credentials
```bash
curl -i -u wronguser:wrongpassword http://localhost:5000/profile
```
*Expected: `HTTP/1.1 401 Unauthorized`*

### 7. Run Automated PowerShell Test Suite
From the project folder, run:
```powershell
powershell -ExecutionPolicy Bypass -File .\test_auth.ps1
```
All 8 verification tests will execute and output pass/fail results.

---

## 📄 License
MIT License. Created for CITYMATE – Smart Tourist Companion.
