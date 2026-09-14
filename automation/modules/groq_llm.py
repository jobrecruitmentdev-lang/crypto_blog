import json
import re
import os
import requests
from datetime import date
from groq import Groq
from tenacity import retry, stop_after_attempt, wait_exponential
from config import Config, logger

CURRENT_LLM_PROVIDER = "groq"
GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

def title_to_slug(title: str) -> str:
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
    return slug[:80]

def _call_groq(messages, temperature=0.3, max_tokens=4096, response_format=None):
    if not Config.GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY missing")
    client = Groq(api_key=Config.GROQ_API_KEY)
    kwargs = {
        "messages": messages,
        "model": GROQ_MODEL,
        "temperature": temperature,
        "max_tokens": max_tokens
    }
    if response_format:
        kwargs["response_format"] = response_format
        
    response = client.chat.completions.create(**kwargs)
    return response.choices[0].message.content.strip()

def _call_llm_with_fallback(messages, temperature=0.3, max_tokens=4096, response_format=None):
    try:
        return _call_groq(messages, temperature, max_tokens, response_format)
    except Exception as e:
        logger.warning(f"Primary Groq model {GROQ_MODEL} failed ({e}), trying qwen/qwen3.6-27b...")
        try:
            client = Groq(api_key=Config.GROQ_API_KEY)
            res = client.chat.completions.create(
                messages=messages,
                model="qwen/qwen3.6-27b",
                temperature=temperature,
                max_tokens=max_tokens,
                response_format=response_format
            )
            return res.choices[0].message.content.strip()
        except Exception as e2:
            logger.error(f"Groq fallback failed: {e2}")
            raise

@retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=2, max=6))
def generate_blog_and_seo(topic: str, context: str = "", real_links: list = None) -> dict:
    today = date.today().isoformat()
    logger.info(f"Generating Omnichannel AEO/GEO blog content for: {topic}")

    system_prompt = """You are the Senior Research Director and AEO/GEO Architect at Crypto Airdrop AI (cryptoairdropai.com).
Your mission is to produce fact-checked, technical Web3 research playbooks optimized for:
1. Google AI Overviews & SGE (Answer Engine Optimization)
2. Perplexity AI, Claude & ChatGPT Search (Generative Engine Optimization)
3. Technical Web3 Precision (Anti-Sybil defense, RPC configurations, testnet execution checklists, smart contract risks)
4. Knowledge Graph Entity Grounding (Linking concepts to primary blockchain ontologies)

CRITICAL STRUCTURAL REQUIREMENTS:
- Return ONLY a valid, parseable JSON object with no markdown fences or preambles.
- 'title': High-CTR, authoritative headline strictly between 35 and 65 characters.
- 'tldr': A standalone 45-65 word definitive quick answer box that directly answers what the airdrop is, who is eligible, and how to qualify (for Google AI Overviews).
- 'key_takeaways': Exactly 4 concise, high-value bullet points summarizing actionable alpha (each 15-30 words).
- 'faqs': Exactly 4 high-intent search questions and structured, direct answers (each answer 25-50 words).
- 'html': Deep technical article in semantic HTML (<h2>, <h3>, <p>, <ol>, <ul>, <strong>). Total body word count MUST be between 650 and 850 words. Write 2-3 detailed paragraphs under each <h2> heading.
- STRICT LINKING RULE: Do NOT include ANY external <a href="http..."> links whatsoever. Keep all text plain without unverified links.
- Must include these sections in html:
    * <h2> Protocol Overview & Architecture
    * <h2> Step-by-Step Testnet & Mainnet Checklist (<ol> with detailed numbered action steps)
    * <h2> Anti-Sybil Defense & Multi-Wallet Safety Checklist
    * <h2> Tokenomics & Expected Snapshot Timeline
"""

    user_prompt = f"""Topic/Target Cluster: {topic}
Today's Date: {today}
Context & Market Intelligence:
{context if context else 'Generate authoritative 2026 Web3 playbook based on on-chain architecture, testnet deployment, and token distribution mechanics.'}

Generate the full JSON payload now:"""

    # Call 1: Generate Deep HTML Body
    body_prompt = f"""Write an authoritative, highly detailed technical Web3 research guide in semantic HTML for: '{topic}'.
Requirements:
- Output ONLY raw semantic HTML without markdown fences (no ```html).
- Do NOT include <h1> tags. Start with <h2>.
- Total length MUST be 600-800 words with rich technical paragraphs and numbered execution steps.
- Do NOT include external http links.
- Structure required:
    <h2>1. Protocol Architecture & Ecosystem Overview</h2>
    <p>Detailed technical architecture explanation...</p>
    <h2>2. Step-by-Step Testnet & Mainnet Checklist</h2>
    <ol><li>Detailed step...</li><li>Detailed step...</li><li>Detailed step...</li><li>Detailed step...</li></ol>
    <h2>3. Anti-Sybil Defense & Multi-Wallet Safety Checklist</h2>
    <p>Detailed sybil defense heuristics and wallet isolation rules...</p>
    <h2>4. Tokenomics, Snapshot Timeline & Expected Criteria</h2>
    <p>Detailed token breakdown and snapshot estimations...</p>
"""
    messages_body = [
        {"role": "system", "content": "You are a senior Web3 researcher at Crypto Airdrop AI."},
        {"role": "user", "content": body_prompt}
    ]
    raw_html = _call_llm_with_fallback(messages_body, temperature=0.3, max_tokens=3000)
    raw_html = raw_html.replace("```html", "").replace("```", "").strip()

    # Call 2: Generate SEO JSON Metadata
    seo_prompt = f"""Generate structured SEO metadata in JSON format for the topic '{topic}'.
Return ONLY a JSON object with this exact schema:
{{
  "title": "Authoritative title under 58 chars",
  "tldr": "Standalone 45-60 word quick answer summary explaining the airdrop and qualification",
  "key_takeaways": [
    "Actionable takeaway point 1 (15-25 words)",
    "Actionable takeaway point 2 (15-25 words)",
    "Actionable takeaway point 3 (15-25 words)",
    "Actionable takeaway point 4 (15-25 words)"
  ],
  "faqs": [
    {{"question": "High intent question 1?", "answer": "Clear concise answer 1 (25-40 words)"}},
    {{"question": "High intent question 2?", "answer": "Clear concise answer 2 (25-40 words)"}},
    {{"question": "High intent question 3?", "answer": "Clear concise answer 3 (25-40 words)"}},
    {{"question": "High intent question 4?", "answer": "Clear concise answer 4 (25-40 words)"}}
  ]
}}"""
    messages_seo = [
        {"role": "system", "content": "You are an SEO metadata specialist. Return ONLY a valid JSON object without markdown formatting."},
        {"role": "user", "content": seo_prompt}
    ]
    raw_seo = _call_llm_with_fallback(messages_seo, temperature=0.2, max_tokens=2048)
    try:
        data = json.loads(raw_seo)
    except Exception:
        match = re.search(r'\{.*\}', raw_seo, re.DOTALL)
        data = json.loads(match.group(0)) if match else {}


    # Format and guarantee fields
    title = data.get("title") or data.get("headline") or topic
    title = title[:58].strip()
    slug = data.get("slug") or title_to_slug(title)
    tldr = data.get("tldr") or data.get("summary") or f"Complete 2026 technical guide for {topic} covering testnet actions, anti-sybil precautions, and snapshot eligibility."
    
    html = raw_html or data.get("html") or data.get("body") or data.get("content") or ""
    if isinstance(html, list):
        html = "".join(f"<p>{p}</p>" if not p.startswith("<") else p for p in html)
        
    raw_takeaways = data.get("key_takeaways") or data.get("takeaways") or []
    if isinstance(raw_takeaways, str):
        raw_takeaways = [t.strip("- ") for t in raw_takeaways.split("\n") if t.strip()]
    key_takeaways = [str(k).strip() for k in raw_takeaways if len(str(k).strip()) >= 10][:4]
    
    raw_faqs = data.get("faqs") or data.get("faq") or []
    faqs = []
    if isinstance(raw_faqs, list):
        for f in raw_faqs:
            if isinstance(f, dict):
                q = f.get("q") or f.get("question") or ""
                a = f.get("a") or f.get("answer") or ""
                if q and a:
                    faqs.append({"question": q, "answer": a, "q": q, "a": a})
    
    seo_obj = {
        "meta_title": title,
        "meta_description": tldr[:155],
        "tldr": tldr,
        "key_takeaways": key_takeaways,
        "faqs": faqs,
        "read_time": data.get("read_time", "6 min read")
    }

    return {
        "title": title,
        "slug": slug,
        "html": html,
        "category": data.get("category", "Ecosystem Alpha"),
        "tldr": tldr,
        "key_takeaways": key_takeaways,
        "faqs": faqs,
        "seo": seo_obj
    }
