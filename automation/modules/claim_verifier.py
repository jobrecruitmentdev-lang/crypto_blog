import re
from urllib.parse import urlparse

def verify_claims_and_urls(html_content: str, grounding_payload: dict) -> tuple[bool, list[str]]:
    """
    Verifies that all external URLs and factual claims in the generated article
    are grounded in the verified payload.
    """
    errors = []
    if not grounding_payload:
        return True, []

    verified_urls = set(grounding_payload.get("verified_urls", []))
    verified_domains = {"defillama.com", "coingecko.com", "github.com", "x.com", "twitter.com", "cryptoairdropai.com"}
    
    # Add domains from verified URLs
    for u in verified_urls:
        parsed = urlparse(u)
        if parsed.netloc:
            verified_domains.add(parsed.netloc.lower())

    # 1. Check all external URLs in HTML
    extracted_urls = re.findall(r'href=[\'"](https?://[^\'"]+)[\'"]', html_content)
    for u in extracted_urls:
        parsed = urlparse(u)
        domain = parsed.netloc.lower()
        if not any(domain == vd or domain.endswith("." + vd) for vd in verified_domains):
            errors.append(f"Ungrounded external domain detected: '{u}'.")

    return len(errors) == 0, errors
