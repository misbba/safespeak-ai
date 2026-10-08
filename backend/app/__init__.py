import os
from flask import Flask
from flask_cors import CORS
from app.config.config import Config
from app.models.database import init_db
from app.routes.api import api_bp

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for frontend communication
    frontend_env = app.config.get("FRONTEND_URL") or os.getenv("FRONTEND_URL", "")
    if frontend_env:
        allowed_origins = [
            "http://localhost:3000", "http://127.0.0.1:3000",
            "http://localhost:5173", "http://127.0.0.1:5173"
        ]
        for url in frontend_env.split(","):
            cleaned = url.strip().rstrip("/")
            if cleaned and cleaned not in allowed_origins:
                allowed_origins.append(cleaned)
        CORS(app, resources={r"/api/*": {"origins": allowed_origins}})
    else:
        CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Ensure upload directory exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Initialize SQLite Database
    init_db(app.config["DATABASE_PATH"])

    # Register API blueprints
    app.register_blueprint(api_bp, url_prefix="/api")

    @app.errorhandler(404)
    def handle_not_found(e):
        return {"error": "Endpoint not found", "status": 404}, 404

    @app.errorhandler(500)
    def handle_server_error(e):
        return {"error": "Internal server error occurred", "status": 500}, 500

    @app.route("/")
    def index():
        return {
            "name": "SafeSpeak AI API",
            "tagline": "Think Before You Click.",
            "status": "healthy",
            "version": "1.0.0"
        }

    return app
