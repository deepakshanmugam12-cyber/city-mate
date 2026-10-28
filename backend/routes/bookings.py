from flask import Blueprint, request, jsonify, g
from database import get_db_connection
from auth import requires_auth, requires_admin, optional_auth
import uuid

bookings_bp = Blueprint("bookings", __name__)

def _generate_booking_ref():
    return "CM-" + uuid.uuid4().hex[:6].upper()

def _get_user_id():
    """Safely extract user id from Flask g.current_user dict."""
    user = getattr(g, "current_user", None)
    if user and isinstance(user, dict):
        return user.get("id")
    return None

@bookings_bp.route("/bookings", methods=["POST"])
@optional_auth
def create_booking():
    data = request.get_json() or {}
    place_id = data.get("place_id")
    visit_date = data.get("visit_date", "").strip()
    visit_time = data.get("visit_time", "").strip()
    num_adults = int(data.get("num_adults", 1))
    num_children = int(data.get("num_children", 0))
    num_seniors = int(data.get("num_seniors", 0))
    visitor_name = data.get("visitor_name", "").strip()
    visitor_email = data.get("visitor_email", "").strip()
    visitor_phone = data.get("visitor_phone", "").strip()
    special_requests = data.get("special_requests", "").strip()

    if not place_id or not visit_date or not visitor_name or not visitor_email:
        return jsonify({"error": "place_id, visit_date, visitor_name, and visitor_email are required."}), 400
    if (num_adults + num_seniors) < 1:
        return jsonify({"error": "At least 1 adult or senior visitor is required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT p.id, p.name, p.image_url, p.address, p.entry_fee, p.opening_hours, c.name as city_name 
        FROM tourist_places p 
        JOIN cities c ON p.city_id = c.id 
        WHERE p.id = ?
    """, (place_id,))
    place = cursor.fetchone()
    if not place:
        conn.close()
        return jsonify({"error": "Tourist place not found."}), 404

    base_fee = float(place["entry_fee"] or 0)
    adult_subtotal = round(base_fee * num_adults, 2)
    child_subtotal = round((base_fee * 0.5) * num_children, 2)
    senior_subtotal = round((base_fee * 0.6) * num_seniors, 2)
    subtotal = round(adult_subtotal + child_subtotal + senior_subtotal, 2)
    tax_amount = round(subtotal * 0.05, 2) if subtotal > 0 else 0.0
    total_amount = round(subtotal + tax_amount, 2)

    # Allow frontend to pass pre-calculated total if provided
    if "total_amount" in data and float(data["total_amount"]) >= 0:
        total_amount = round(float(data["total_amount"]), 2)
    if "tax_amount" in data:
        tax_amount = round(float(data["tax_amount"]), 2)

    booking_ref = _generate_booking_ref()
    user_id = _get_user_id()

    cursor.execute(
        """INSERT INTO bookings 
           (booking_ref, place_id, user_id, visitor_name, visitor_email, visitor_phone, 
            visit_date, visit_time, num_adults, num_children, num_seniors, total_amount, 
            tax_amount, special_requests, status) 
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,'confirmed')""",
        (booking_ref, place_id, user_id, visitor_name, visitor_email, visitor_phone, 
         visit_date, visit_time, num_adults, num_children, num_seniors, total_amount, 
         tax_amount, special_requests)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return jsonify({
        "message": "Booking confirmed successfully!",
        "booking": {
            "id": new_id, 
            "booking_ref": booking_ref,
            "place_id": place_id,
            "place_name": place["name"],
            "city_name": place["city_name"],
            "image_url": place["image_url"],
            "address": place["address"],
            "visit_date": visit_date,
            "visit_time": visit_time,
            "num_adults": num_adults,
            "num_children": num_children,
            "num_seniors": num_seniors,
            "adult_subtotal": adult_subtotal,
            "child_subtotal": child_subtotal,
            "senior_subtotal": senior_subtotal,
            "subtotal": subtotal,
            "tax_amount": tax_amount,
            "total_amount": total_amount,
            "status": "confirmed",
            "visitor_name": visitor_name,
            "visitor_email": visitor_email,
            "visitor_phone": visitor_phone,
            "special_requests": special_requests,
            "entry_fee_per_person": place["entry_fee"],
            "opening_hours": place["opening_hours"]
        }
    }), 201


@bookings_bp.route("/bookings", methods=["GET"])
@optional_auth
def list_my_bookings():
    user = getattr(g, "current_user", None)
    user_id = user.get("id") if (user and isinstance(user, dict)) else None
    email = user.get("email") if (user and isinstance(user, dict)) else request.args.get("email")
    conn = get_db_connection()
    cursor = conn.cursor()
    if user_id:
        cursor.execute(
            """SELECT b.*, p.name as place_name, p.image_url, p.address, c.name as city_name 
               FROM bookings b 
               JOIN tourist_places p ON b.place_id = p.id 
               JOIN cities c ON p.city_id = c.id 
               WHERE b.user_id = ? OR b.user_id IS NULL OR b.visitor_email = ? 
               ORDER BY b.created_at DESC""",
            (user_id, email or "")
        )
    else:
        cursor.execute(
            """SELECT b.*, p.name as place_name, p.image_url, p.address, c.name as city_name 
               FROM bookings b 
               JOIN tourist_places p ON b.place_id = p.id 
               JOIN cities c ON p.city_id = c.id 
               ORDER BY b.created_at DESC"""
        )
    rows = cursor.fetchall()
    conn.close()
    return jsonify({"bookings": [dict(r) for r in rows], "count": len(rows)})


@bookings_bp.route("/bookings/<int:booking_id>", methods=["GET"])
@optional_auth
def get_booking(booking_id):
    user_id = _get_user_id()
    conn = get_db_connection()
    cursor = conn.cursor()
    if user_id:
        cursor.execute(
            "SELECT b.*, p.name as place_name, p.image_url, p.address, p.opening_hours, c.name as city_name FROM bookings b JOIN tourist_places p ON b.place_id = p.id JOIN cities c ON p.city_id = c.id WHERE b.id = ? AND b.user_id = ?",
            (booking_id, user_id)
        )
    else:
        cursor.execute(
            "SELECT b.*, p.name as place_name, p.image_url, p.address, p.opening_hours, c.name as city_name FROM bookings b JOIN tourist_places p ON b.place_id = p.id JOIN cities c ON p.city_id = c.id WHERE b.id = ?",
            (booking_id,)
        )
    row = cursor.fetchone()
    conn.close()
    if not row:
        return jsonify({"error": "Booking not found."}), 404
    return jsonify({"booking": dict(row)})


@bookings_bp.route("/bookings/<int:booking_id>/cancel", methods=["PUT"])
@optional_auth
def cancel_booking(booking_id):
    user_id = _get_user_id()
    conn = get_db_connection()
    cursor = conn.cursor()
    if user_id:
        cursor.execute("SELECT id, status FROM bookings WHERE id = ? AND (user_id = ? OR user_id IS NULL)", (booking_id, user_id))
    else:
        cursor.execute("SELECT id, status FROM bookings WHERE id = ?", (booking_id,))
    booking = cursor.fetchone()
    if not booking:
        conn.close()
        return jsonify({"error": "Booking not found."}), 404
    if booking["status"] == "cancelled":
        conn.close()
        return jsonify({"error": "Booking is already cancelled."}), 400
    cursor.execute("UPDATE bookings SET status = 'cancelled' WHERE id = ?", (booking_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Booking cancelled successfully."})


@bookings_bp.route("/bookings/lookup", methods=["GET"])
@optional_auth
def lookup_booking():
    booking_ref = request.args.get("booking_ref", "").strip()
    email = request.args.get("email", "").strip()

    if not booking_ref:
        return jsonify({"error": "Booking reference number is required."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    if email:
        cursor.execute(
            """SELECT b.*, p.name as place_name, p.image_url, p.address, p.opening_hours, c.name as city_name 
               FROM bookings b 
               JOIN tourist_places p ON b.place_id = p.id 
               JOIN cities c ON p.city_id = c.id 
               WHERE (UPPER(b.booking_ref) = UPPER(?) OR b.booking_ref = ?) 
                 AND LOWER(b.visitor_email) = LOWER(?)""",
            (booking_ref, booking_ref, email)
        )
    else:
        cursor.execute(
            """SELECT b.*, p.name as place_name, p.image_url, p.address, p.opening_hours, c.name as city_name 
               FROM bookings b 
               JOIN tourist_places p ON b.place_id = p.id 
               JOIN cities c ON p.city_id = c.id 
               WHERE UPPER(b.booking_ref) = UPPER(?) OR b.booking_ref = ?""",
            (booking_ref, booking_ref)
        )
    row = cursor.fetchone()
    conn.close()

    if not row:
        return jsonify({"error": "No booking found matching the provided details."}), 404

    return jsonify({"booking": dict(row)})


@bookings_bp.route("/admin/bookings", methods=["GET"])
@requires_admin
def admin_list_bookings():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """SELECT b.*, p.name as place_name, c.name as city_name 
           FROM bookings b 
           JOIN tourist_places p ON b.place_id = p.id 
           JOIN cities c ON p.city_id = c.id 
           ORDER BY b.created_at DESC"""
    )
    rows = cursor.fetchall()
    bookings_list = [dict(r) for r in rows]

    total_sales = sum(float(b["total_amount"] or 0) for b in bookings_list if b["status"] == "confirmed")
    confirmed_count = sum(1 for b in bookings_list if b["status"] == "confirmed")
    cancelled_count = sum(1 for b in bookings_list if b["status"] == "cancelled")

    conn.close()
    return jsonify({
        "bookings": bookings_list, 
        "count": len(bookings_list),
        "stats": {
            "total_bookings": len(bookings_list),
            "confirmed_bookings": confirmed_count,
            "cancelled_bookings": cancelled_count,
            "total_sales_revenue": round(total_sales, 2)
        }
    })


@bookings_bp.route("/admin/bookings/<int:booking_id>/status", methods=["PUT"])
@requires_admin
def admin_update_booking_status(booking_id):
    data = request.get_json() or {}
    new_status = data.get("status", "").strip().lower()
    if new_status not in ["confirmed", "cancelled", "pending"]:
        return jsonify({"error": "Invalid status. Must be confirmed, cancelled, or pending."}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE bookings SET status = ? WHERE id = ?", (new_status, booking_id))
    conn.commit()
    conn.close()
    return jsonify({"message": f"Booking #{booking_id} status updated to {new_status}."})
