import urllib.request
import json

print("=== LIVE PROJECTS API: https://cryptoairdropai.com/api/projects.php ===")
req = urllib.request.Request('https://cryptoairdropai.com/api/projects.php', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode('utf-8'))
    projects = data.get('projects', [])
    print(f"Total projects from live MySQL: {len(projects)}")
    for p in projects:
        print(f"  {p.get('slug'):<22} | {p.get('featuredImage')}")

print("\n=== LIVE ARTICLES API: https://cryptoairdropai.com/api/articles.php ===")
req = urllib.request.Request('https://cryptoairdropai.com/api/articles.php', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as res:
    data = json.loads(res.read().decode('utf-8'))
    articles = data.get('articles', [])
    print(f"Total articles from live MySQL: {len(articles)}")
    for a in articles:
        print(f"  {a.get('slug'):<50} | {a.get('featuredImage')}")
