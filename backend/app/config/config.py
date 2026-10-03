import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load .env file from backend root or project root
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR.parent / ".env")

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "safespeak-ai-dev-secret-key-2026")
    
    # AI API configuration
    AI_API_KEY = os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
    AI_PROVIDER = os.getenv("AI_PROVIDER", "auto")  # 'gemini', 'openai', or 'auto'
    AI_MODEL = os.getenv("AI_MODEL", "gemini-2.5-flash")
    
    # Upload limits
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB limit
    ALLOWED_IMAGE_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "gif", "bmp"}

    # Database
    DATA_FOLDER = os.path.join(BASE_DIR, "data")
    DATABASE_PATH = os.path.join(DATA_FOLDER, "safespeak.db")
    
    # Pre-create data folder
    os.makedirs(DATA_FOLDER, exist_ok=True)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
