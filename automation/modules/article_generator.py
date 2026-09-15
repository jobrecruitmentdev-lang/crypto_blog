import os
import sys
import json
import time
import random
import re
from pathlib import Path
from groq import Groq
from dotenv import load_dotenv

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

load_dotenv(dotenv_path=AUTOMATION_ROOT / ".env")
load_dotenv()

from modules.ai_image_engine import generate_article_images_trio

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")
groq_client = Groq(api_key=GROQ_API_KEY)

INTELLIGENCE_QUEUE = [
    "Story Protocol Intellectual Property Testnet Airdrop Strategy",
    "Fuel Network Layer 2 High Speed Execution Testnet Playbook",
    "Babylon Bitcoin Staking Mainnet Distribution & Points Guide",
    "Eclipse SVM Ethereum Layer 2 Early Positioning Checklist",
    "Symbiotic Restaking Network Allocation & Strategy Guide",
    "Initia Interwoven Rollup Network Incentivized Public Testnet",
    "Movement Labs Move-EVM Incentivized Testnet Architecture",
    "MegaETH Real-Time EVM High Frequency Airdrop Roadmap",
    "Sonic SVM High Throughput Incentive Points Framework",
    "Mitosis Multi-Chain Liquidity Expedition Allocation Guide",
    "Hyperliquid L1 DEX Liquidity Points & Genesis Allocation",
    "Plume Network RWA Modular Layer 2 Early Incentives Manual"
]

GUIDES_QUEUE = [
    "Cross-Chain Bridging & Liquidity Routing Security Manual",
    "Understanding Snapshot Mechanics & Block Heights in Web3 Airdrops",
    "Mastering On-Chain Sybil Resistance Heuristics & Behavioral Hygiene",
    "Multi-Account CEX Funding Isolation & Sub-Wallet Hygiene Guide",
    "Hardware Wallet Multisig Security for Airdrop Farming Operations",
    "Automating On-Chain Cadence: Weekly Transaction Randomization Protocols",
    "Testnet RPC Configuration & Transaction Relay Acceleration Manual",
    "Navigating Anti-Sybil Clustering: Graph Analysis & Timing Signatures",
    "Zero-Knowledge Proof Rollup Interaction & Gas Optimization Manual",
    "Smart Contract Risk Assessment Checklist Before Interacting With Testnets"
]

PAGE_CONFIGS = {
    "intelligence": {
        "system_prompt": (
            "You are a Senior Hedge-Fund Crypto Market Intelligence Director and On-Chain Quantitative Analyst. "
            "Your objective is to write exhaustive, institutional-grade, highly actionable crypto research reports. "
            "Your analysis must be deeply technical, dissecting tokenomics, vesting schedules, Layer 1/Layer 2 architecture, "
            "protocol revenue, and macroeconomic catalysts. "
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
            "Tone: Tactical, precise, step-by-step, security-first."
        ),
        "tag": "Farming Playbook",
        "author": "ai-intelligence-engine"
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

AVAILABLE_MODELS = [
    os.getenv("GROQ_MODEL", "groq/compound-mini"),
    "groq/compound-mini",
    "qwen/qwen3.8-27b"
]

def call_llm(prompt: str, system_prompt: str, max_tokens: int = 1200, temperature: float = 0.7) -> str:
    for model in AVAILABLE_MODELS:
        for attempt in range(2):
            try:
                resp = groq_client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=temperature,
                    max_tokens=max_tokens
                )
                content = resp.choices[0].message.content
                if content and len(content.strip()) > 50:
                    time.sleep(1.5) # Gentle rate-limit pacing
                    return content.strip()
            except Exception as e:
                print(f"[-] Model '{model}' attempt {attempt+1} note: {e}")
                time.sleep(3)
    raise RuntimeError("All LLM generation models failed.")

def generate_article(topic: str, page_type: str = "intelligence", dry_run: bool = False) -> dict:
    if page_type not in PAGE_CONFIGS:
        page_type = "intelligence"

    cfg = PAGE_CONFIGS[page_type]
    slug = title_to_slug(topic)

    print("=" * 70)
    print(f"🚀 Generating {page_type.upper()} Article: '{topic}'")
    print("=" * 70)

    if page_type == "intelligence":
        # Target: 2,200 - 2,600 words, 4-6 FAQs
        faq_count = random.randint(4, 6)

        print(f"[*] Intelligence Section 1/3: Executive Thesis & Protocol Architecture (~850 words)...")
        p1 = f"""You are authoring Section 1 of an exhaustive research paper on '{topic}'.
Write strictly in semantic HTML (<h2>, <h3>, <p>, <ul>, <blockquote>).
Include:
- <h2>1. Executive Summary & Macroeconomic Thesis</h2> (In-depth analysis of market positioning, catalysts, and ecosystem scope)
- <h2>2. Technical Architecture & On-Chain State Invariants</h2> (Bytecode design, consensus mechanism, data availability, and state transitions)
Write comprehensive, deeply analytical paragraphs. Aim for 800 to 950 words. Do NOT include FAQ or conclusion yet. Return ONLY HTML with no markdown code fences."""
        part1_html = call_llm(p1, cfg["system_prompt"], max_tokens=1200)

        time.sleep(2)

        print(f"[*] Intelligence Section 2/3: Execution Playbook & Sybil Defense (~900 words)...")
        p2 = f"""You are authoring Section 2 of the research paper on '{topic}'.
Write strictly in semantic HTML (<h2>, <h3>, <p>, <ol>, <ul>, <strong>).
Include:
- <h2>3. Step-by-Step Strategic Execution Playbook</h2> (Detailed numbered <ol> sequence with specific testnet/mainnet interactions)
- <h2>4. On-Chain Sybil Defense & Multi-Vector Wallet Hygiene</h2> (CEX funding isolation, cluster graph avoidance, timing randomness, and transaction frequency)
Write thorough, granular technical guidelines. Aim for 850 to 950 words. Return ONLY HTML with no markdown code fences."""
        part2_html = call_llm(p2, cfg["system_prompt"], max_tokens=1200)

        time.sleep(2)

        print(f"[*] Intelligence Section 3/3: Valuation, Tokenomics & Verdict (~800 words)...")
        p3 = f"""You are authoring Section 3 of the research paper on '{topic}'.
Write strictly in semantic HTML (<h2>, <h3>, <p>, <table>, <ul>, <blockquote>).
Include:
- <h2>5. Quantitative Valuation, Tokenomics & Vesting Dynamics</h2> (Include a structured HTML comparison <table> with columns: Metric, Protocol Specification, Comparative Benchmark, Assessment)
- <h2>6. Security Risk Matrix & Smart Contract Failure Modes</h2>
- <h2>7. Strategic Verdict & Snapshot Horizon</h2>
Aim for 750 to 850 words. Return ONLY HTML with no markdown code fences."""
        part3_html = call_llm(p3, cfg["system_prompt"], max_tokens=1200)

        raw_html = f"{part1_html}\n\n{part2_html}\n\n{part3_html}".replace("```html", "").replace("```", "").strip()

    else: # guides
        # Target: 1,800 - 2,200 words, 4-7 FAQs
        faq_count = random.randint(4, 7)

        print(f"[*] Guides Section 1/2: Prerequisites & Infrastructure Setup (~950 words)...")
        p1 = f"""You are authoring Section 1 of a definitive tactical farming guide on '{topic}'.
Write strictly in semantic HTML (<h2>, <h3>, <p>, <ol>, <ul>, <blockquote>).
Include:
- <h2>1. Technical Prerequisites & Wallet Isolation Setup</h2> (Hardware wallet configuration, sub-account creation, RPC setup)
- <h2>2. Cross-Chain Bridging & Gas Management Manual</h2> (Verified bridge endpoints, low-fee routing, and deposit scheduling)
Write granular step-by-step guidance. Aim for 900 to 1,000 words. Return ONLY HTML with no markdown code fences."""
        part1_html = call_llm(p1, cfg["system_prompt"], max_tokens=1200)

        time.sleep(2)

        print(f"[*] Guides Section 2/2: Core Protocol Execution & Sybil Avoidance (~1,050 words)...")
        p2 = f"""You are authoring Section 2 of the tactical farming guide on '{topic}'.
Write strictly in semantic HTML (<h2>, <h3>, <p>, <ol>, <table>, <strong>).
Include:
- <h2>3. Core Smart Contract Farming Runbook</h2> (Numbered step-by-step checklist of weekly and daily protocol interactions)
- <h2>4. Advanced Sybil Resistance: Heuristic Clustering Defense</h2> (Avoiding common sybil filters, graph overlap, CEX withdrawal traces)
- <h2>5. Snapshot Qualification Checklist & Reward Matrix</h2> (Include an HTML <table> of eligibility criteria, weights, and estimated point yields)
Aim for 1,000 to 1,100 words. Return ONLY HTML with no markdown code fences."""
        part2_html = call_llm(p2, cfg["system_prompt"], max_tokens=1200)

        raw_html = f"{part1_html}\n\n{part2_html}".replace("```html", "").replace("```", "").strip()

    # Calculate word count
    plain_text = re.sub(r'<[^>]+>', ' ', raw_html)
    actual_words = len(plain_text.split())
    print(f"[+] Total Article HTML Assembled: {actual_words:,} words!")

    time.sleep(1)

    # Generate Metadata & FAQs
    meta_prompt = f"""Generate structured JSON metadata for this {page_type} publication:
Topic: {topic}
Length: {actual_words} words

Return ONLY valid parseable JSON:
{{
    "title": "Authoritative headline under 65 chars",
    "excerpt": "Engaging technical summary between 140 and 160 characters",
    "tldr": "Actionable 2-sentence summary answering what this is and how to qualify.",
    "key_takeaways": [
        "Concise actionable bullet 1 (15-25 words)",
        "Concise actionable bullet 2 (15-25 words)",
        "Concise actionable bullet 3 (15-25 words)",
        "Concise actionable bullet 4 (15-25 words)"
    ],
    "faqs": [
        {{"question": "High-intent search inquiry 1?", "answer": "Detailed 3-4 sentence factual answer."}},
        {{"question": "High-intent search inquiry 2?", "answer": "Detailed 3-4 sentence factual answer."}},
        {{"question": "High-intent search inquiry 3?", "answer": "Detailed 3-4 sentence factual answer."}},
        {{"question": "High-intent search inquiry 4?", "answer": "Detailed 3-4 sentence factual answer."}},
        {{"question": "High-intent search inquiry 5?", "answer": "Detailed 3-4 sentence factual answer."}}
    ]
}}
Ensure exactly {faq_count} FAQs are generated."""

    print(f"[*] Generating SEO metadata & {faq_count} Schema FAQs...")
    meta_raw = call_llm(meta_prompt, "You are an SEO metadata and FAQ schema specialist. Return ONLY valid JSON.", max_tokens=1500, temperature=0.3)
    match = re.search(r'\{.*\}', meta_raw, re.DOTALL)
    meta_json = json.loads(match.group(0)) if match else {}

    title = meta_json.get("title", topic)
    excerpt = meta_json.get("excerpt", f"Comprehensive technical guide to {topic}.")
    tldr = meta_json.get("tldr", excerpt)
    key_takeaways = meta_json.get("key_takeaways", [
        "Maintain isolated wallets funded through independent exchange deposit channels.",
        "Execute interactions across multiple verified smart contracts to boost contract diversity score.",
        "Spread transaction timestamps across different calendar weeks to avoid burst-activity sybil flags."
    ])
    faqs = meta_json.get("faqs", [
        {"question": f"What are the qualification criteria for {topic}?", "answer": "Users must complete verified on-chain interactions with official smart contracts using independent wallets."},
        {"question": "When is the snapshot expected?", "answer": "Protocol snapshots are typically scheduled prior to mainnet genesis and token generation events."},
        {"question": "How to avoid sybil disqualification?", "answer": "Avoid batch-funding wallets from the same centralized exchange account or executing transactions at identical timestamps."},
        {"question": "Are user private keys required?", "answer": "Zero custody: all operations occur directly via non-custodial Web3 wallets without disclosing credentials."}
    ])

    # 3 Topic-Specific Visuals
    images = generate_article_images_trio(topic, slug, category=cfg["tag"])

    read_mins = max(6, round(actual_words / 220))
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

    # Save into Central Store
    articles = load_existing_articles()
    articles = [a for a in articles if a.get("slug") != slug]
    articles.insert(0, article_record)
    save_articles(articles)

    print(f"[✓] Published {page_type} article: /{ 'blog' if page_type == 'intelligence' else 'guides' }/{slug}/ ({actual_words} words, {len(faqs)} FAQs)")
    return article_record

def generate_batch_articles(page_type: str = "intelligence", count: int = 3) -> list:
    existing = load_existing_articles()
    existing_slugs = {a["slug"] for a in existing}
    
    queue = INTELLIGENCE_QUEUE if page_type == "intelligence" else GUIDES_QUEUE
    selected_topics = []

    for t in queue:
        slug = title_to_slug(t)
        if slug not in existing_slugs and t not in selected_topics:
            selected_topics.append(t)
        if len(selected_topics) >= count:
            break

    # If all curated are posted, append timestamped variants
    idx = 1
    while len(selected_topics) < count:
        fallback = f"{queue[idx % len(queue)]} Edition {idx+1}"
        selected_topics.append(fallback)
        idx += 1

    print(f"\n[+] Selected {count} {page_type} topics: {selected_topics}")
    results = []
    for t in selected_topics:
        res = generate_article(topic=t, page_type=page_type)
        results.append(res)
    return results

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--type", default="intelligence", choices=["intelligence", "guides"])
    parser.add_argument("--count", type=int, default=1)
    args = parser.parse_args()
    generate_batch_articles(page_type=args.type, count=args.count)
