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
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Ensure upload directory exists
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

    # Initialize SQLite Database
    init_db(app.config["DATABASE_PATH"])

    # Register API blueprints
    app.register_blueprint(api_bp, url_prefix="/api")

    @app.route("/")
    def index():
        return {
            "name": "SafeSpeak AI API",
            "tagline": "Think Before You Click.",
            "status": "healthy",
            "version": "1.0.0"
        }

    return app
