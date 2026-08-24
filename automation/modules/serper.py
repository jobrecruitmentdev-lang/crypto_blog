import requests
from tenacity import retry, stop_after_attempt, wait_exponential
from config import Config, logger

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def search_google(query: str) -> list:
    """Returns top organic results as a list of {title, snippet, link} dicts,
    so downstream generation can cite real source URLs instead of inventing them."""
    url = "https://google.serper.dev/search"

    if not Config.SERPER_API_KEY:
        logger.warning("No SERPER_API_KEY found, skipping Google search.")
        return []

    headers = {
        "X-API-KEY": Config.SERPER_API_KEY,
        "Content-Type": "application/json"
    }

    # Modifying query to target crypto news
    crypto_query = f"{query} crypto news this week"
    logger.info(f"Fetching Google context for: {crypto_query}")

    response = requests.post(url, json={"q": crypto_query}, headers=headers, timeout=10)
    response.raise_for_status()

    data = response.json()
    organic_results = data.get("organic", [])

    results = []
    for result in organic_results[:5]:  # Take top 5
        results.append({
            "title": result.get("title", ""),
            "snippet": result.get("snippet", ""),
            "link": result.get("link", "")
        })

    return results

def format_context(results: list) -> str:
    """Flattened text form of search_google()'s results, for prompts that just need context text."""
    return "\n\n".join(
        f"Title: {r['title']}\nSnippet: {r['snippet']}\nLink: {r['link']}"
        for r in results
    )
