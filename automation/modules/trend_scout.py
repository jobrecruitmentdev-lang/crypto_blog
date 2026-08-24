import requests
from config import logger
from modules.sheets import sheets_manager

def scout_trends():
    logger.info("=== Starting Trend Scout ===")
    
    candidates = set()

    # 1. CoinGecko Trending
    try:
        cg_res = requests.get("https://api.coingecko.com/api/v3/search/trending", timeout=10)
        if cg_res.status_code == 200:
            data = cg_res.json()
            for item in data.get("coins", [])[:5]:
                name = item["item"]["name"]
                candidates.add(f"{name} airdrop")
                candidates.add(f"{name} token")
    except Exception as e:
        logger.error(f"Error fetching CoinGecko trends: {e}")

    # 2. DeFiLlama Top Gainers
    try:
        dl_res = requests.get("https://api.llama.fi/protocols", timeout=20)
        if dl_res.status_code == 200:
            data = dl_res.json()
            valid_protocols = [p for p in data if isinstance(p.get("change_1d"), (int, float))]
            valid_protocols.sort(key=lambda x: x["change_1d"], reverse=True)
            for item in valid_protocols[:5]:
                candidates.add(f"{item['name']} protocol airdrop")
    except Exception as e:
        logger.error(f"Error fetching DeFiLlama trends: {e}")

    logger.info(f"Found {len(candidates)} candidate trends.")
    
    if not candidates:
        logger.info("No trends found.")
        return

    try:
        worksheet = sheets_manager.sheet.worksheet("Data")
        existing = worksheet.col_values(1)[1:] 
        existing_lower = [e.lower().strip() for e in existing]

        new_rows = []
        for c in candidates:
            if c.lower() not in existing_lower:
                new_rows.append([c] + [""] * 13)
        
        if new_rows:
            worksheet.append_rows(new_rows)
            logger.info(f"Added {len(new_rows)} new trends to 'Data' sheet.")
        else:
            logger.info("All candidates already exist in the sheet.")
            
    except Exception as e:
        logger.error(f"Error writing to Google Sheets: {e}")
        
    logger.info("=== Trend Scout Finished ===")

if __name__ == "__main__":
    scout_trends()
