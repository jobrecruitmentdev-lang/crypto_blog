import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

class Config:
    GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID")
    GOOGLE_CREDENTIALS_FILE = os.getenv("GOOGLE_CREDENTIALS_FILE", "credentials/service_account.json")
    
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
    SERPER_API_KEY = os.getenv("SERPER_API_KEY")
    
    STRAPI_URL = os.getenv("STRAPI_URL", "http://localhost:1337")
    STRAPI_API_TOKEN = os.getenv("STRAPI_API_TOKEN")
    
    SITE_URL = os.getenv("SITE_URL", "https://cryptodrop.com")
    AUTO_PUBLISH = os.getenv("AUTO_PUBLISH", "false").lower() == "true"

os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    handlers=[
        logging.FileHandler("logs/blog.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("blog_automation")
