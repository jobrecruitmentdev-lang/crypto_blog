import json, os, hashlib, sys
sys.stdout.reconfigure(encoding='utf-8')

articles = json.load(open('web/src/data/articles.json', encoding='utf-8'))
slugs = [
    'story-protocol-intellectual-property-testnet-airdrop-strategy',
    'eclipse-svm-ethereum-layer-2-early-positioning-checklist',
    'monad-ecosystem-parallel-evm-airdrop-playbook'
]
for a in articles:
    if a['slug'] in slugs:
        img = a.get('featuredImage')
        disk_path = os.path.join('web/public', img.lstrip('/'))
        h = hashlib.md5(open(disk_path, 'rb').read()).hexdigest() if os.path.exists(disk_path) else 'N/A'
        size = os.path.getsize(disk_path) // 1024 if os.path.exists(disk_path) else 0
        print(f"{a['slug']} -> {img} | hash={h} | size={size} KB")
