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
- 'title': High-CTR, authoritative headline strictly under 58 characters.
- 'tldr': A standalone 40-60 word definitive quick answer box that directly answers what the airdrop is, who is eligible, and how to qualify (for Google AI Overviews).
- 'key_takeaways': Exactly 4 concise, high-value bullet points summarizing actionable alpha.
- 'faqs': Exactly 4 high-intent search questions and structured, direct answers.
- 'html': Deep technical article in semantic HTML (<h2>, <h3>, <p>, <ol>, <ul>, <strong>). Must include:
    * <h2> Protocol Overview & Architecture
    * <h2> Step-by-Step Testnet & Mainnet Checklist (<ol> with numbered action steps)
    * <h2> Anti-Sybil Defense & Multi-Wallet Safety
    * <h2> Tokenomics & Expected Snapshot Timeline
"""

    user_prompt = f"""Topic/Target Cluster: {topic}
Today's Date: {today}
Context & Market Intelligence:
{context if context else 'Generate authoritative 2026 Web3 playbook based on on-chain architecture, testnet deployment, and token distribution mechanics.'}

Generate the full JSON payload now:"""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    try:
        raw_response = _call_llm_with_fallback(
            messages=messages,
            temperature=0.2,
            max_tokens=4096,
            response_format={"type": "json_object"}
        )
        data = json.loads(raw_response)
    except Exception as e:
        logger.warning(f"Structured JSON call failed ({e}), attempting text cleanup...")
        raw_response = _call_llm_with_fallback(messages=messages, temperature=0.2, max_tokens=4096)
        match = re.search(r'\{.*\}', raw_response, re.DOTALL)
        if match:
            data = json.loads(match.group(0))
        else:
            raise ValueError("Failed to parse JSON response from LLM")

    # Format and guarantee fields
    title = data.get("title", topic)[:58]
    slug = data.get("slug") or title_to_slug(title)
    tldr = data.get("tldr") or f"Complete 2026 technical guide for {topic} covering testnet actions, anti-sybil precautions, and snapshot eligibility."
    
    seo_obj = {
        "meta_title": title,
        "meta_description": tldr[:155],
        "tldr": tldr,
        "key_takeaways": data.get("key_takeaways", []),
        "faqs": data.get("faqs", []),
        "read_time": data.get("read_time", "5 min read")
    }

    return {
        "title": title,
        "slug": slug,
        "html": data.get("html", f"<p>{tldr}</p>"),
        "category": data.get("category", "Ecosystem Alpha"),
        "tldr": tldr,
        "key_takeaways": data.get("key_takeaways", []),
        "faqs": data.get("faqs", []),
        "seo": seo_obj
    }
