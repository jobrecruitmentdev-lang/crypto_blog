import os
import sys
from dotenv import load_dotenv
import logging

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

# Load environment variables
load_dotenv()

class Config:
    GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID")
    GOOGLE_CREDENTIALS_FILE = os.getenv("GOOGLE_CREDENTIALS_FILE", "credentials/service_account.json")
    
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
    NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY")
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    SERPER_API_KEY = os.getenv("SERPER_API_KEY")
    
    SUPABASE_URL = os.getenv("SUPABASE_URL", "https://oebuqronflnytkdyckxi.supabase.co")
    SITE_URL = os.getenv("SITE_URL", "https://cryptoairdropai.com")
    AUTO_PUBLISH = os.getenv("AUTO_PUBLISH", "true").lower() == "true"

os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    handlers=[
        logging.FileHandler("logs/blog.log", encoding="utf-8"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("blog_automation")
