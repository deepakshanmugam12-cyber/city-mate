# Blueprint exports for CityMate API
from .auth import auth_bp
from .places import places_bp
from .services import services_bp
from .reviews import reviews_bp
from .favorites import favorites_bp
from .recommendations import recommendations_bp
from .planner import planner_bp
from .admin import admin_bp
from .feedback import feedback_bp
from .bookings import bookings_bp

__all__ = [
    'auth_bp',
    'places_bp',
    'services_bp',
    'reviews_bp',
    'favorites_bp',
    'recommendations_bp',
    'planner_bp',
    'admin_bp',
    'feedback_bp',
    'bookings_bp'
]
