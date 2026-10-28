import os
import re
import urllib.request
import json
import base64

print("=== 1. CHECKING BACKEND ROUTES & APIS ===")
base_url = 'http://127.0.0.1:5000'

# Check main page
try:
    res = urllib.request.urlopen(base_url + '/')
    print(f"GET / -> Status: {res.status}")
except Exception as e:
    print(f"Error GET /: {e}")

# Check cities
try:
    res = urllib.request.urlopen(base_url + '/api/cities')
    cities = json.loads(res.read().decode('utf-8')).get('cities', [])
    print(f"GET /api/cities -> {len(cities)} cities loaded")
except Exception as e:
    print(f"Error /api/cities: {e}")

# Check places
try:
    res = urllib.request.urlopen(base_url + '/api/places')
    places = json.loads(res.read().decode('utf-8')).get('places', [])
    print(f"GET /api/places -> {len(places)} places loaded")
except Exception as e:
    print(f"Error /api/places: {e}")

# Check bookings list
try:
    res = urllib.request.urlopen(base_url + '/api/bookings')
    bookings = json.loads(res.read().decode('utf-8')).get('bookings', [])
    print(f"GET /api/bookings -> {len(bookings)} bookings loaded")
except Exception as e:
    print(f"Error /api/bookings: {e}")

# Check admin bookings
try:
    token = base64.b64encode(b'admin:admin123').decode('ascii')
    req = urllib.request.Request(base_url + '/api/admin/bookings', headers={'Authorization': 'Basic ' + token})
    res = urllib.request.urlopen(req)
    admin_bk = json.loads(res.read().decode('utf-8'))
    print(f"GET /api/admin/bookings -> {admin_bk.get('count')} bookings, stats: {admin_bk.get('stats')}")
except Exception as e:
    print(f"Error /api/admin/bookings: {e}")

# Check admin stats
try:
    req = urllib.request.Request(base_url + '/api/admin/stats', headers={'Authorization': 'Basic ' + token})
    res = urllib.request.urlopen(req)
    stats = json.loads(res.read().decode('utf-8'))
    print(f"GET /api/admin/stats -> {stats.get('stats')}")
except Exception as e:
    print(f"Error /api/admin/stats: {e}")

print("\n=== 2. CHECKING FRONTEND HTML & JS INTEGRITY ===")
with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Check for duplicate IDs
id_matches = re.findall(r'id=["\']([^"\']+)["\']', html)
id_counts = {}
for i in id_matches:
    id_counts[i] = id_counts.get(i, 0) + 1

duplicates = [k for k, v in id_counts.items() if v > 1]
if duplicates:
    print("WARNING: Duplicate HTML IDs found:", duplicates)
else:
    print("HTML ID uniqueness: OK (No duplicates)")

# Check elements referenced by getElementById in JS
all_ids = set(id_matches)
js_dir = 'frontend/js'
missing_refs = []
for js_file in os.listdir(js_dir):
    if js_file.endswith('.js'):
        with open(os.path.join(js_dir, js_file), 'r', encoding='utf-8') as f:
            content = f.read()
        for ref in re.findall(r'document\.getElementById\(["\']([^"\']+)["\']\)', content):
            if ref not in all_ids:
                # Filter out known dynamically created elements
                if not any(ref.startswith(prefix) for prefix in ['modal-tab-', 'bk-card-', 'city-opt-', 'ticket-pass-modal', 'place-details-tab-']):
                    missing_refs.append((js_file, ref))

if missing_refs:
    print("\nPotentially missing element IDs referenced in JS:")
    for js_file, ref in sorted(set(missing_refs)):
        print(f"  [{js_file}] -> #{ref}")
else:
    print("All static getElementById references exist in HTML: OK")

print("\n=== 3. CHECKING SCRIPT TAGS IN INDEX.HTML ===")
script_srcs = re.findall(r'<script\s+src=["\']([^"\']+)["\']', html)
for src in script_srcs:
    if src.startswith('http'):
        continue
    local_path = os.path.join('frontend', src)
    if os.path.exists(local_path):
        print(f"Script: {src} -> Found (size: {os.path.getsize(local_path)} bytes)")
    else:
        print(f"ERROR: Script not found: {src} (at {local_path})")

print("\n=== Verification Complete ===")
