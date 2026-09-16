import subprocess, json, sys

sys.stdout.reconfigure(encoding='utf-8')
output = subprocess.check_output(['git', 'show', '19e578c95a69ee813fc8594cb32d2c30c7b0dcb1:web/src/data/articles.json'], text=True, encoding='utf-8')
data = json.loads(output)

print(f"Total articles in previous commit: {len(data)}")
for a in data:
    ptype = a.get('pageType', 'N/A')
    slug = a.get('slug', 'N/A')
    title = a.get('title', 'N/A')[:45]
    print(f"{ptype:<12} | {slug:<55} | {title}")
