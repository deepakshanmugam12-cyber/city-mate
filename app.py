"""
CityMate - Root launcher
Run: python app.py
"""
import sys
import os

root_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, root_dir)

from backend.app import app, setup_application

if __name__ == '__main__':
    setup_application()
    port = int(os.environ.get('PORT', 5000))
    print(f"\n=======================================================")
    print(f"  CITYMATE – Smart Tourist Companion Backend Running")
    print(f"  Local URL: http://127.0.0.1:{port}")
    print(f"=======================================================\n")
    app.run(host='0.0.0.0', port=port, debug=True)
