import requests
from tenacity import retry, stop_after_attempt, wait_exponential
from config import logger

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def get_coingecko_data(query: str) -> list:
    """Fetch price/market cap info from CoinGecko for crypto grounding."""
    url = f"https://api.coingecko.com/api/v3/search?query={query}"
    
    logger.info(f"Fetching CoinGecko data for: {query}")
    results = []
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        coins = data.get("coins", [])
        
        for coin in coins[:2]:  # Take top 2
            coin_id = coin.get("api_symbol", coin.get("id"))
            market_url = f"https://api.coingecko.com/api/v3/simple/price?ids={coin_id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true"
            m_res = requests.get(market_url, timeout=10)
            m_res.raise_for_status()
            m_data = m_res.json()
            
            if coin_id in m_data:
                info = m_data[coin_id]
                from datetime import datetime
                today = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
                results.append({
                    "title": f"CoinGecko Market Data: {coin.get('name')} ({coin.get('symbol')})",
                    "snippet": f"Price: ${info.get('usd')}, Market Cap: ${info.get('usd_market_cap')}, 24h Vol: ${info.get('usd_24h_vol')}, 24h Change: {info.get('usd_24h_change')}%. Data as of {today}.",
                    "link": f"https://www.coingecko.com/en/coins/{coin_id}"
                })
    except Exception as e:
        logger.warning(f"CoinGecko fetch failed for '{query}': {e}")
        
    return results

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def get_defillama_data(query: str) -> list:
    """Fetch TVL info from DeFiLlama."""
    logger.info(f"Fetching DeFiLlama data for: {query}")
    results = []
    try:
        response = requests.get("https://api.llama.fi/protocols", timeout=20)
        response.raise_for_status()
        protocols = response.json()
        
        query_lower = query.lower()
        matched = [p for p in protocols if query_lower in p.get('name', '').lower() or query_lower in p.get('symbol', '').lower()]
        
        for p in matched[:2]:
            from datetime import datetime
            today = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
            results.append({
                "title": f"DeFiLlama TVL Data: {p.get('name')}",
                "snippet": f"TVL: ${p.get('tvl')}, Category: {p.get('category')}, Chain: {p.get('chain')}. Data as of {today}.",
                "link": f"https://defillama.com/protocol/{p.get('slug')}"
            })
    except Exception as e:
        logger.warning(f"DeFiLlama fetch failed for '{query}': {e}")
        
    return results

def get_market_data(query: str) -> list:
    results = []
    try:
        results.extend(get_coingecko_data(query))
    except:
        pass
    try:
        results.extend(get_defillama_data(query))
    except:
        pass
    return results
