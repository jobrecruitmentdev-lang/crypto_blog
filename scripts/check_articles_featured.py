import json, sys
sys.stdout.reconfigure(encoding='utf-8')

articles = json.load(open('web/src/data/articles.json', encoding='utf-8'))
print(f"Total current articles: {len(articles)}")
for i, a in enumerate(articles):
    ptype = a.get("pageType", "blog")
    slug = a.get("slug")
    feat = a.get("featuredImage")
    print(f"{i+1:2d}. {ptype:<12} | {slug:<60} | {feat}")
