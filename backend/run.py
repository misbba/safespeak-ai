import os
from app import create_app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "127.0.0.1")
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    print(f"[*] Starting SafeSpeak AI Backend on http://{host}:{port}")
    app.run(host=host, port=port, debug=debug, use_reloader=False)
