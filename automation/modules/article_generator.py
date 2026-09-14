import os
import sys
import json
import time
import random
import re
from pathlib import Path
from groq import Groq

# Force UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
AUTOMATION_ROOT = Path(__file__).resolve().parent.parent
MODULES_DIR = Path(__file__).resolve().parent
ARTICLES_FILE = PROJECT_ROOT / "web" / "src" / "data" / "articles.json"

sys.path.extend([str(AUTOMATION_ROOT), str(MODULES_DIR), str(PROJECT_ROOT)])

from modules.ai_image_engine import generate_article_images_trio

from dotenv import load_dotenv
load_dotenv(dotenv_path=AUTOMATION_ROOT / ".env")
load_dotenv()

# Groq Setup
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
groq_client = Groq(api_key=GROQ_API_KEY)

PAGE_CONFIGS = {
    "intelligence": {
        "system_prompt": (
            "You are a Senior Hedge-Fund Crypto Market Intelligence Director and On-Chain Quantitative Analyst. "
            "Your objective is to write exhaustive, institutional-grade, highly actionable crypto research reports. "
            "Your analysis must be deeply technical, dissecting tokenomics, vesting schedules, Layer 1/Layer 2 architecture, "
            "protocol revenue, and macroeconomic catalysts. "
            "Output must be strictly between 2,200 and 2,500 words in length, structured with <h2>, <h3>, <table>, <ul>, <ol>, and <blockquote> tags. "
            "Tone: Institutional, authoritative, analytical, non-promotional."
        ),
        "tag": "Market Intelligence",
        "author": "ai-intelligence-engine"
    },
    "guides": {
        "system_prompt": (
            "You are an Elite Web3 Airdrop Farming Strategist and Testnet Execution Engineer. "
            "Your objective is to write the definitive, step-by-step technical farming playbook for this protocol. "
            "Cover wallet isolation manuals, bridge routes, smart contract interactions, transaction randomization, "
            "anti-sybil heuristics, gas optimization, and snapshot timing indicators. "
            "Output must be strictly between 2,200 and 2,500 words in length, structured with numbered steps, sub-phases, warning boxes, and action tables. "
            "Tone: Tactical, precise, step-by-step, security-first."
        ),
        "tag": "Farming Playbook",
        "author": "ai-intelligence-engine"
    },
    "methodology": {
        "system_prompt": (
            "You are a Lead Smart Contract Security Auditor and Web3 Protocol Evaluation Specialist at Crypto Airdrop AI. "
            "Your objective is to write a rigorous, formal research paper detailing the 5-Stage Audit Framework and security telemetry applied to decentralized protocols. "
            "Examine attack vectors, honeypot filters, proxy upgradeability risks, liquidity locks, decentralization scoring, and sybil resistance formulas. "
            "Output must be strictly between 2,200 and 2,500 words in length, featuring audit matrices, risk level breakdowns, and technical telemetry standards. "
            "Tone: Academic, forensic, white-hat security auditing."
        ),
        "tag": "Security Framework",
        "author": "security-sentinel-ai"
    },
    "editorial": {
        "system_prompt": (
            "You are the Chief Standards Editor and Fact-Checking Ombudsman at Crypto Airdrop AI. "
            "Your objective is to author an authoritative editorial treatise on crypto journalism ethics, source verification, "
            "anti-shilling policies, conflict-of-interest disclosures, and global regulatory compliance (SEC, EU MiCA). "
            "Explain cryptographic source verification, corrections protocols, and non-financial advice standards. "
            "Output must be strictly between 2,200 and 2,500 words in length, structured into clear ethical principles and operational governance clauses. "
            "Tone: Formal, uncompromising journalistic integrity."
        ),
        "tag": "Editorial Integrity",
        "author": "editorial-desk"
    }
}

def title_to_slug(title: str) -> str:
    s = title.lower()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s_]+', '-', s)
    return s.strip('-')[:80]

def load_existing_articles() -> list:
    if ARTICLES_FILE.exists():
        try:
            with open(ARTICLES_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"[-] Error reading articles.json: {e}")
    return []

def save_articles(articles: list):
    ARTICLES_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(ARTICLES_FILE, "w", encoding="utf-8") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)
    print(f"[+] Successfully saved {len(articles)} articles to {ARTICLES_FILE}")

def generate_article(topic: str, page_type: str = "intelligence", dry_run: bool = False) -> dict:
    if page_type not in PAGE_CONFIGS:
        raise ValueError(f"Invalid page_type '{page_type}'. Choose from: {list(PAGE_CONFIGS.keys())}")

    cfg = PAGE_CONFIGS[page_type]
    target_words = random.randint(2250, 2450)
    faq_count = random.randint(4, 6)

    print("=" * 70)
    print(f"🚀 Generating {page_type.upper()} Article: '{topic}'")
    print(f"   Target Length: {target_words} words | FAQs: {faq_count} items")
    print("=" * 70)

    slug = title_to_slug(topic)

    # Progressive Multi-Section Generation to guarantee 2,200 - 2,500 words
    print(f"[*] Section 1/3: Generating Foundations & Architecture (Target: 850 words)...")
    prompt_p1 = f"""You are authoring Section 1 of an in-depth {page_type} report on '{topic}'.
Write strictly in semantic HTML (<h2>, <h3>, <p>, <ul>, <blockquote>).
Cover:
- <h2>1. Executive Summary & Foundational Architecture</h2>
- <h2>2. In-Depth On-Chain Mechanics & Protocol Telemetry</h2>
Write at least 800-900 words of technical analysis. Do NOT write conclusions or FAQs yet. No markdown fences.
"""
    resp_p1 = groq_client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "system", "content": cfg["system_prompt"]}, {"role": "user", "content": prompt_p1}],
        temperature=0.7,
        max_tokens=1500
    )
    part1_html = resp_p1.choices[0].message.content.strip()

    time.sleep(2)

    print(f"[*] Section 2/3: Generating Strategic Execution Playbook & Sybil Defense (Target: 850 words)...")
    prompt_p2 = f"""You are authoring Section 2 of the report on '{topic}'.
Write strictly in semantic HTML (<h2>, <h3>, <p>, <ol>, <ul>, <strong>).
Cover:
- <h2>3. Step-by-Step Strategic Execution Playbook</h2> (Include detailed numbered <ol> steps)
- <h2>4. Anti-Sybil Defense & Multi-Vector Wallet Hygiene</h2>
Write at least 800-900 words of step-by-step guidance. No markdown fences.
"""
    resp_p2 = groq_client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "system", "content": cfg["system_prompt"]}, {"role": "user", "content": prompt_p2}],
        temperature=0.7,
        max_tokens=1500
    )
    part2_html = resp_p2.choices[0].message.content.strip()

    time.sleep(2)

    print(f"[*] Section 3/3: Generating Tokenomics, Security Matrix & Horizon (Target: 750 words)...")
    prompt_p3 = f"""You are authoring Section 3 of the report on '{topic}'.
Write strictly in semantic HTML (<h2>, <h3>, <p>, <table>, <ul>, <blockquote>).
Cover:
- <h2>5. Quantitative Valuation, Tokenomics & Vesting Dynamics</h2> (Include a comparison <table>)
- <h2>6. Security Risk Matrix & Protocol Failure Modes</h2>
- <h2>7. Strategic Verdict & Snapshot Horizon</h2>
Write at least 700-800 words with a structured comparison table. No markdown fences.
"""
    resp_p3 = groq_client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "system", "content": cfg["system_prompt"]}, {"role": "user", "content": prompt_p3}],
        temperature=0.7,
        max_tokens=1500
    )
    part3_html = resp_p3.choices[0].message.content.strip()

    # Combine all 3 parts
    raw_html = f"{part1_html}\n\n{part2_html}\n\n{part3_html}".replace("```html", "").replace("```", "").strip()

    # Calculate actual word count
    plain_text = re.sub(r'<[^>]+>', ' ', raw_html)
    actual_words = len(plain_text.split())
    print(f"[+] Total Article HTML Assembled: {actual_words:,} words across 7 major <h2> sections!")

    time.sleep(2)

    # Generate Structured Metadata & FAQs
    meta_prompt = f"""Generate structured JSON metadata for this {page_type} publication:
Topic: {topic}
Length: {actual_words} words

Return ONLY valid JSON:
{{
    "title": "Authoritative headline under 65 chars",
    "excerpt": "Engaging summary between 140 and 160 characters",
    "tldr": "Actionable 2-sentence summary answering what this is and how to qualify.",
    "key_takeaways": [
        "Takeaway 1 (minimum 15 words)",
        "Takeaway 2 (minimum 15 words)",
        "Takeaway 3 (minimum 15 words)",
        "Takeaway 4 (minimum 15 words)"
    ],
    "faqs": [
        {{"question": "High-intent search inquiry 1?", "answer": "Detailed 3-4 sentence factual answer."}},
        {{"question": "High-intent search inquiry 2?", "answer": "Detailed 3-4 sentence factual answer."}},
        {{"question": "High-intent search inquiry 3?", "answer": "Detailed 3-4 sentence factual answer."}},
        {{"question": "High-intent search inquiry 4?", "answer": "Detailed 3-4 sentence factual answer."}},
        {{"question": "High-intent search inquiry 5?", "answer": "Detailed 3-4 sentence factual answer."}}
    ]
}}
Ensure exactly {faq_count} FAQs are returned.
"""

    print(f"[*] Generating SEO metadata & {faq_count} FAQs...")
    meta_resp = groq_client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {"role": "system", "content": "You are a professional SEO metadata and AEO structured data generator. Return ONLY valid JSON."},
            {"role": "user", "content": meta_prompt}
        ],
        temperature=0.4,
        max_tokens=1500
    )

    raw_meta = meta_resp.choices[0].message.content.strip()
    match = re.search(r'\{.*\}', raw_meta, re.DOTALL)
    meta_json = json.loads(match.group(0)) if match else {}

    title = meta_json.get("title", topic)
    excerpt = meta_json.get("excerpt", f"Comprehensive technical guide to {topic}.")
    tldr = meta_json.get("tldr", excerpt)
    key_takeaways = meta_json.get("key_takeaways", [])
    faqs = meta_json.get("faqs", [])

    if dry_run:
        print("[*] Dry run enabled. Skipping image generation and file write.")
        return data

    # 2. Generate the 3 Unique 8K Images
    images = generate_article_images_trio(topic, slug)

    read_mins = max(5, round(actual_words / 220))
    read_time = f"{read_mins} min read"
    now_date = time.strftime("%Y-%m-%d")

    article_record = {
        "slug": slug,
        "pageType": page_type,
        "tag": cfg["tag"],
        "title": title,
        "excerpt": excerpt,
        "tldr": tldr,
        "keyTakeaways": key_takeaways,
        "date": now_date,
        "updatedAt": now_date,
        "read": read_time,
        "authorSlug": cfg["author"],
        "body": raw_html,
        "featuredImage": images["featured_image"],
        "middleImage": images["middle_image"],
        "preFaqImage": images["pre_faq_image"],
        "faqs": [{"question": f.get("question") or f.get("q", ""), "answer": f.get("answer") or f.get("a", "")} for f in faqs],
        "seo": {
            "metaTitle": f"{title} | Crypto Airdrop AI",
            "metaDescription": excerpt[:155],
            "keywords": [topic, page_type, "crypto airdrop", "web3", "blockchain"]
        }
    }

    # 3. Save into Central Store
    articles = load_existing_articles()
    # Remove existing with same slug if any
    articles = [a for a in articles if a.get("slug") != slug]
    articles.insert(0, article_record)
    save_articles(articles)

    print(f"[✓] Completed and published {page_type} article: /blog/{slug}/ (or /{page_type}/{slug}/)")
    return article_record

if __name__ == "__main__":
    # Test generation of 1 guide
    generate_article(
        topic="Solana Multi-Wallet Isolation & Sybil Defense Masterclass 2026",
        page_type="guides"
    )
