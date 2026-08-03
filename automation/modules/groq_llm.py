import json
import re
import requests
from datetime import date
from groq import Groq
from tenacity import retry, stop_after_attempt, wait_exponential
from config import Config, logger

CURRENT_LLM_PROVIDER = "groq"

def title_to_slug(title: str) -> str:
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
    return slug[:80]

def _mock_output(topic: str) -> dict:
    return {
        "title": topic,
        "slug": title_to_slug(topic),
        "html": f"<p>Test content about {topic}.</p>",
        "faqs": [],
        "faqSchema": "",
        "category": "DeFi",
        "seo": {
            "meta_title": topic[:60],
            "meta_description": f"Learn about {topic}.",
            "focus_keyword": topic,
            "keywords": [topic],
            "og_title": topic,
            "og_description": f"Learn about {topic}."
        }
    }

def _call_groq(messages, temperature, max_tokens, response_format):
    if not Config.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY missing")
    client = Groq(api_key=Config.GROQ_API_KEY)
    kwargs = {
        "messages": messages,
        "model": "llama-3.3-70b-versatile",
        "temperature": temperature,
        "max_tokens": max_tokens
    }
    if response_format:
        kwargs["response_format"] = response_format
        
    response = client.chat.completions.create(**kwargs)
    return response.choices[0].message.content.strip()

def _call_nvidia(messages, temperature, max_tokens):
    if not Config.NVIDIA_API_KEY:
        raise ValueError("NVIDIA_API_KEY missing")
    url = "https://integrate.api.nvidia.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {Config.NVIDIA_API_KEY}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "meta/llama-3.1-70b-instruct",
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens
    }
    resp = requests.post(url, headers=headers, json=payload, timeout=120)
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"].strip()
    
def _call_openrouter(messages, temperature, max_tokens):
    if not Config.OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY missing")
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {Config.OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "meta-llama/llama-3.3-70b-instruct",
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens
    }
    resp = requests.post(url, headers=headers, json=payload, timeout=120)
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"].strip()

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def _call_llm_with_fallback(messages, temperature, max_tokens=4096, response_format=None):
    global CURRENT_LLM_PROVIDER
    
    if CURRENT_LLM_PROVIDER == "groq":
        try:
            return _call_groq(messages, temperature, max_tokens, response_format)
        except Exception as e:
            logger.warning(f"Groq API failed ({e}). Falling back to NVIDIA NIM...")
            CURRENT_LLM_PROVIDER = "nvidia"
            
    if CURRENT_LLM_PROVIDER == "nvidia":
        try:
            return _call_nvidia(messages, temperature, max_tokens)
        except Exception as e:
            logger.warning(f"NVIDIA API failed ({e}). Falling back to OpenRouter...")
            CURRENT_LLM_PROVIDER = "openrouter"
            
    if CURRENT_LLM_PROVIDER == "openrouter":
        return _call_openrouter(messages, temperature, max_tokens)
        
    raise ValueError("All LLM providers failed")

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def generate_blog_and_seo(topic: str, context: str, real_links: list) -> dict:
    if not Config.GROQ_API_KEY and not Config.NVIDIA_API_KEY and not Config.OPENROUTER_API_KEY:
        logger.warning("No API keys found for any LLM. Mocking output.")
        return _mock_output(topic)

    today = date.today().isoformat()
    logger.info(f"Generating blog content for: {topic}")

    blog_prompt = f"""You are an expert Crypto/Web3 SEO and GEO (Generative Engine Optimization) writer.
Write a comprehensive, AI-citation-optimised blog post in HTML that builds Topical Authority.
The topic is a cluster of related keywords separated by '|': '{topic}'.
Seamlessly cover all these keywords/concepts in a unified, deeply informative post.

SEARCH CONTEXT & MARKET DATA (use for facts and citations):
{context}

REAL CITATION URLS — only use these, never invent a URL:
{chr(10).join(real_links)}

=== GEO/AEO MANDATORY RULES ===

1. PARAGRAPH LENGTH (most critical rule):
   Every single <p> tag between headers MUST be 134-167 words.
   Expand with technical detail, tokenomics context, and examples until you hit 134-167.

2. ZERO UNSOURCED STATISTICS:
   Every number, percentage, range, spec, TVL, or price MUST be hyperlinked:
   <a href="REAL_URL">claim text</a>
   If you cannot link it to one of the real URLs above, do NOT write it.
   Never invent a URL.

3. STRUCTURE — strict hierarchy:
   - Start directly with an intro <p> (134-167 words), no heading above it
   - Then at least 3 <h2> sections, each with at least one <h3> sub-section
   - NO <h1> tags anywhere — the page already renders its own H1 title
   - Include at least one <ul> or <ol> list in the body

4. COMPARISON TABLE (conditional):
   If the topic allows comparison (L1s, L2s, yields, airdrop criteria), include one
   <table> with <thead> and <tbody>. 

5. RISK & SECURITY NOTES (conditional):
   Add an <h3> subsection covering sybil-avoidance, wallet safety, and common scam patterns
   for this specific topic. 

6. HOW TO PARTICIPATE / ELIGIBILITY CRITERIA (conditional):
   If this is an airdrop or guide-type topic, add a section with an <ol> step list detailing how to qualify.

7. STRICT LEGAL POSTURE:
   - This is NOT financial advice. State this clearly.
   - BANNED WORDS: "will 10x", "guaranteed profit", "risk-free", "certain".
   - Qualify all rewards as "reported", "estimated", or "speculated".
   - Include this disclaimer near the top:
     <div class="disclaimer" style="margin-bottom:20px;padding:10px;background:#fde8e8;border-left:4px solid #f97316;">
     <strong>Disclaimer:</strong> This content is for educational purposes only and does not constitute financial advice. Crypto investments carry inherent risks.
     </div>

8. AUTHOR BIO:
<div class="author-bio" style="margin-top:30px;padding:15px;background:#f9f9f9;border-left:4px solid #333;">
<h3>About the Author: CryptoDrop Research Desk</h3>
<p>The CryptoDrop Research Desk analyzes emerging DeFi trends, airdrop opportunities, and Layer 2 ecosystems.</p>
</div>

9. FURTHER READING — end with:
<h2>Further Reading</h2>
<ul>
[2-4 <li><a href="REAL_URL">descriptive anchor text</a></li> using ONLY the real URLs above]
</ul>

10. ARTICLE SCHEMA — append this JSON-LD block at the very end of HTML output:
<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"Article","headline":"REPLACE_WITH_TITLE","description":"REPLACE_WITH_150_CHAR_SUMMARY","author":{{"@type":"Organization","name":"CryptoDrop Research Desk","url":"https://cryptodrop.com"}},"publisher":{{"@type":"Organization","name":"CryptoDrop","url":"https://cryptodrop.com"}},"dateModified":"{today}"}}
</script>

11. NO EMOJIS anywhere in the HTML.

Output ONLY the raw HTML — no markdown, no explanation, no code fences."""

    blog_html = _call_llm_with_fallback(
        messages=[{"role": "user", "content": blog_prompt}],
        temperature=0.7,
        max_tokens=4096
    )

    blog_html = re.sub(r'<h1[^>]*>.*?</h1>\s*', '', blog_html, flags=re.IGNORECASE | re.DOTALL)
    blog_html = re.sub(r'^```(?:html)?\s*', '', blog_html, flags=re.MULTILINE)
    blog_html = re.sub(r'\s*```$', '', blog_html, flags=re.MULTILINE).strip()

    logger.info(f"Blog HTML generated ({len(blog_html.split())} words). Generating SEO metadata...")

    seo_prompt = f"""You are an expert Crypto SEO strategist. Using the topic cluster: '{topic}' and this context:
{context}

Return ONLY valid JSON — no markdown, no code fences.

Required fields:
{{
  "title": "SEO-optimised title. Under 70 chars. No emojis.",
  "slug": "clean-hyphenated-url-slug-from-title (lowercase, max 80 chars)",
  "meta_title": "Under 60 chars. No emojis.",
  "meta_description": "150-160 chars. Includes focus keyword. No emojis.",
  "focus_keyword": "Primary keyword phrase",
  "keywords": ["4-5 related SEO keyword phrases"],
  "og_title": "Open Graph title string",
  "og_description": "Open Graph description string",
  "category": "Exactly one from: Ethereum | Solana | Layer 2 | DeFi | Gaming | AI | NFT | Wallet | Exchange | Bitcoin",
  "faqs": [
    {{"question": "Real user search query about '{topic}'", "answer": "80-120 word answer with at least one specific numeric fact (TVL, price, percentage, year). Prefer facts from market data context."}},
    {{"question": "...", "answer": "..."}},
    {{"question": "...", "answer": "..."}},
    {{"question": "...", "answer": "..."}}
  ],
  "faqSchema": "{{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"FAQPage\\",\\"mainEntity\\":[{{\\"@type\\":\\"Question\\",\\"name\\":\\"Q1\\",\\"acceptedAnswer\\":{{\\"@type\\":\\"Answer\\",\\"text\\":\\"A1\\"}}}},{{\\"@type\\":\\"Question\\",\\"name\\":\\"Q2\\",\\"acceptedAnswer\\":{{\\"@type\\":\\"Answer\\",\\"text\\":\\"A2\\"}}}},{{\\"@type\\":\\"Question\\",\\"name\\":\\"Q3\\",\\"acceptedAnswer\\":{{\\"@type\\":\\"Answer\\",\\"text\\":\\"A3\\"}}}},{{\\"@type\\":\\"Question\\",\\"name\\":\\"Q4\\",\\"acceptedAnswer\\":{{\\"@type\\":\\"Answer\\",\\"text\\":\\"A4\\"}}}}]}}"
}}

Rules:
- Exactly 4 FAQs
- JSON output only
- Use exact category string from the allowed list
"""

    seo_content = _call_llm_with_fallback(
        messages=[{"role": "user", "content": seo_prompt}],
        temperature=0.3,
        response_format={"type": "json_object"} if CURRENT_LLM_PROVIDER == "groq" else None
    )

    seo_content = re.sub(r'^```(?:json)?\s*', '', seo_content, flags=re.MULTILINE)
    seo_content = re.sub(r'\s*```$', '', seo_content, flags=re.MULTILINE).strip()

    seo_data = {}
    try:
        seo_data = json.loads(seo_content)
    except Exception as e:
        logger.error(f"Failed to parse SEO JSON: {e}")

    faqs = seo_data.pop("faqs", []) or []
    faq_schema = seo_data.pop("faqSchema", "") or ""
    category = seo_data.pop("category", "") or "DeFi"
    title = seo_data.get("title", topic)
    slug = seo_data.pop("slug", None) or title_to_slug(title)

    slug = re.sub(r'[^a-z0-9-]', '', slug.lower().replace(' ', '-'))
    slug = re.sub(r'-+', '-', slug).strip('-')[:80]

    logger.info(f"AI title: {title} | slug: {slug} | category: {category} | faqs: {len(faqs)}")

    return {
        "title": title,
        "slug": slug,
        "html": blog_html,
        "faqs": faqs[:4],
        "faqSchema": faq_schema,
        "category": category,
        "seo": seo_data
    }
