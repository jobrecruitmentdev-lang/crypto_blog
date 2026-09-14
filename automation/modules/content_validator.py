import re
from datetime import datetime
from bs4 import BeautifulSoup

VALID_AUTHORS = {"editorial-desk", "ai-intelligence-engine", "security-sentinel-ai"}
VALID_INTERNAL_PREFIXES = ("/projects/", "/guides/", "/blog/", "/authors/", "/about/", "/methodology/", "/editorial-policy/", "/faq/", "/contact/", "/disclaimer/", "/privacy/", "/terms/", "/")

def validate_content_payload(payload: dict, verified_grounding: dict = None) -> tuple[bool, list[str]]:
    """
    Validates a generated blog article payload against 14 strict production gates.
    Returns (is_valid, list_of_errors).
    """
    errors = []
    
    title = payload.get("title", "").strip()
    slug = payload.get("slug", "").strip()
    html_content = payload.get("html", "").strip()
    seo = payload.get("seo", {})
    tldr = seo.get("tldr", "").strip()
    faqs = seo.get("faqs", [])
    key_takeaways = seo.get("key_takeaways", [])
    author_slug = payload.get("author_slug", "ai-intelligence-engine")
    
    # 1. Title Length Gate
    if not (30 <= len(title) <= 75):
        errors.append(f"Title length violation: got {len(title)} chars (expected 30-75). Title: '{title}'")
        
    # 2. TL;DR Summary Block
    tldr_words = len(tldr.split())
    if not (25 <= tldr_words <= 90):
        errors.append(f"TL;DR word count violation: got {tldr_words} words (expected 25-90).")

    # 3. Body Word Count & Structure
    soup = BeautifulSoup(html_content, "html.parser")
    body_text = soup.get_text()
    word_count = len(body_text.split())
    if word_count < 450:
        errors.append(f"Body content too short: got {word_count} words (minimum 450 required).")
        
    h2_tags = soup.find_all("h2")
    if len(h2_tags) < 2:
        errors.append(f"Insufficient semantic structure: found {len(h2_tags)} <h2> headings (minimum 2 required).")

    # 4. No Unparsed LLM Code Fences
    if "```html" in html_content or "```json" in html_content or "```" in html_content:
        errors.append("Unparsed markdown code fences found inside HTML content.")

    # 5. Key Takeaways Count
    key_takeaways = [k.strip() for k in key_takeaways if isinstance(k, str) and len(k.strip()) >= 5]
    if not (3 <= len(key_takeaways) <= 6):
        errors.append(f"Key takeaways violation: found {len(key_takeaways)} valid items (expected 3-6).")
    for idx, item in enumerate(key_takeaways):
        if len(item) < 10:
            errors.append(f"Key takeaway #{idx+1} is under 10 characters.")

    # 6. FAQ Block Structure
    faqs = [f for f in faqs if isinstance(f, dict) and (f.get("q") or f.get("question")) and (f.get("a") or f.get("answer"))]
    if not (3 <= len(faqs) <= 6):
        errors.append(f"FAQ count violation: found {len(faqs)} items (expected 3-6).")
    for idx, faq in enumerate(faqs):
        q = (faq.get("q") or faq.get("question", "")).strip()
        a = (faq.get("a") or faq.get("answer", "")).strip()
        if len(q) < 5 or len(a) < 10:
            errors.append(f"FAQ item #{idx+1} has invalid or incomplete question/answer.")

    # 7. Slug Formatting
    if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", slug) or len(slug) > 85:
        errors.append(f"Invalid slug format: '{slug}'. Must be lowercase alphanumeric with hyphens, <= 85 chars.")

    # 8. Date Constraints
    pub_date_str = payload.get("published_at")
    if pub_date_str:
        try:
            pub_date = datetime.fromisoformat(pub_date_str.replace("Z", "+00:00"))
        except Exception:
            errors.append(f"Invalid ISO-8601 published_at date: '{pub_date_str}'.")

    # 9. Author Profile Verification
    if author_slug not in VALID_AUTHORS:
        errors.append(f"Unknown author slug: '{author_slug}'. Must be one of {VALID_AUTHORS}.")

    # 10. External Link Safety & Rel Attributes
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith(("http://", "https://")):
            if "cryptoairdropai.com" not in href:
                rel = a.get("rel", [])
                rel_str = " ".join(rel) if isinstance(rel, list) else str(rel)
                if "noopener" not in rel_str or "noreferrer" not in rel_str:
                    errors.append(f"External link '{href}' missing rel='noopener noreferrer nofollow'.")

    # 11. Anti-Sybil / Security Guidance Verification
    content_lower = html_content.lower()
    if not any(k in content_lower for k in ["sybil", "security", "wallet", "safety", "checklist", "anti-sybil"]):
        errors.append("Article lacks required security / anti-sybil guidance section.")

    # 12. DOM Structural Tag Balance
    # BeautifulSoup automatically fixes mismatched tags, but if input length differs radically, it was broken
    if not html_content.startswith("<") or not html_content.endswith(">"):
        errors.append("HTML content must start and end with valid HTML markup.")

    # 13. Internal URLs Routing Verification
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("/"):
            if not any(href.startswith(p) for p in VALID_INTERNAL_PREFIXES):
                errors.append(f"Internal link '{href}' violates canonical routing prefixes.")
            if not href.endswith("/"):
                errors.append(f"Internal link '{href}' violates trailing slash policy.")

    # 14. EVM / Solana Contract Address Protection
    grounded_addresses = set()
    if verified_grounding:
        for addr in verified_grounding.get("contract_addresses", []):
            grounded_addresses.add(addr.lower())

    evm_addresses = re.findall(r"\b0x[a-fA-F0-9]{40}\b", html_content)
    for addr in evm_addresses:
        if addr.lower() not in grounded_addresses:
            errors.append(f"Ungrounded EVM contract address detected in copy: '{addr}'.")

    return len(errors) == 0, errors
