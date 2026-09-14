import json
from pathlib import Path

p_file = Path('web/src/data/projects.json')
projects = json.loads(p_file.read_text(encoding='utf-8'))
slugs = {p['slug'] for p in projects}

base = [
    {'slug': 'monad', 'name': 'Monad', 'chain': 'Monad', 'status': ['Ongoing', 'Confirmed'], 'reward': '$500-$5000', 'difficulty': 'Medium', 'time': '20 min', 'heat': 145, 'desc': 'Explore mainnet and testnet features across the high-performance parallel L1.', 'tags': ['L1', 'Confirmed']},
    {'slug': 'jupiter', 'name': 'Jupiter', 'chain': 'Solana', 'status': ['Ongoing', 'Confirmed'], 'reward': 'Claim Live', 'difficulty': 'Easy', 'time': '5 min', 'heat': 88, 'desc': 'Stake JUP to be eligible for ongoing ASR governance token rewards.', 'tags': ['Solana', 'Confirmed']},
    {'slug': 'gmgn', 'name': 'GMGN', 'chain': 'Robinhood Chain', 'status': ['Ongoing'], 'reward': '$500-$3000', 'difficulty': 'Easy', 'time': '25 min/week', 'heat': 52, 'desc': 'Multi-chain meme token trading terminal with copy trading and smart-money tracking.', 'tags': ['Trading', 'DeFi']},
    {'slug': 'privacy-pools', 'name': 'Privacy Pools', 'chain': 'Ethereum', 'status': ['Ongoing'], 'reward': '$200-$800', 'difficulty': 'Medium', 'time': '15 min', 'heat': 38, 'desc': 'Generate entropy, complete contribution and deposit for privacy-preserving pools.', 'tags': ['Privacy', 'Ethereum']},
    {'slug': 'legend', 'name': 'Legend', 'chain': 'Solana', 'status': ['Ongoing'], 'reward': '$300-$1200', 'difficulty': 'Easy', 'time': '10 min', 'heat': 41, 'desc': 'Sign up, deposit, trade and refer users on this fast-growing platform.', 'tags': ['Trading', 'Solana']},
    {'slug': 'ducat', 'name': 'Ducat', 'chain': 'Base', 'status': ['Ongoing'], 'reward': 'TBA', 'difficulty': 'Easy', 'time': '5 min', 'heat': 29, 'desc': 'Join Discord, request and redeem code to participate.', 'tags': ['Discord', 'Base']},
    {'slug': 'arcus', 'name': 'Arcus', 'chain': 'Arbitrum', 'status': ['Ongoing'], 'reward': '$400-$1500', 'difficulty': 'Medium', 'time': '20 min', 'heat': 492, 'desc': 'Sign up, join waitlist and trade spot markets on Arcus.', 'tags': ['Trading', 'L2']},
    {'slug': 'solpump', 'name': 'SolPump', 'chain': 'Solana', 'status': ['Ongoing'], 'reward': '$50-$300', 'difficulty': 'Easy', 'time': '5 min/hr', 'heat': 411, 'desc': 'Participate hourly to grab free SOL rewards.', 'tags': ['Solana', 'Gaming']},
    {'slug': 'ondo-perps', 'name': 'Ondo Perps', 'chain': 'Ethereum', 'status': ['Ongoing', 'Confirmed'], 'reward': '$1000+', 'difficulty': 'Medium', 'time': '30 min', 'heat': 301, 'desc': 'Join and start trading perpetuals with confirmed token rewards.', 'tags': ['DeFi', 'Confirmed']},
    {'slug': 'hypertrade', 'name': 'Hypertrade', 'chain': 'Base', 'status': ['Ongoing'], 'reward': '$300-$900', 'difficulty': 'Easy', 'time': '15 min', 'heat': 276, 'desc': 'Make swaps and add liquidity to earn potential allocation.', 'tags': ['DeFi', 'Base']},
    {'slug': '3jane', 'name': '3Jane', 'chain': 'Ethereum', 'status': ['Ongoing', 'Confirmed'], 'reward': '$200-$700', 'difficulty': 'Easy', 'time': '10 min', 'heat': 24, 'desc': 'Supply USDC to the protocol for confirmed reward eligibility.', 'tags': ['DeFi', 'Stablecoin']},
    {'slug': 'hoodtracker', 'name': 'HoodTracker', 'chain': 'Robinhood Chain', 'status': ['Ongoing', 'Confirmed'], 'reward': '$150-$600', 'difficulty': 'Easy', 'time': '10 min', 'heat': 19, 'desc': 'Connect X, complete social tasks and hold HDTX tokens.', 'tags': ['Social', 'Robinhood Chain']}
]

for b in base:
    if b['slug'] not in slugs:
        b['featuredImage'] = f"/images/generated/{b['slug']}-project.jpg"
        b['farmingSteps'] = [
            {'step': 1, 'title': 'Connect Non-Custodial Wallet', 'desc': f'Connect MetaMask, Rabby, or Phantom to {b["name"]} interface.'},
            {'step': 2, 'title': 'Execute Protocol Action', 'desc': b['desc']},
            {'step': 3, 'title': 'Maintain Cadence', 'desc': 'Perform volume transactions weekly to prevent sybil exclusion.'}
        ]
        b['officialLinks'] = {'website': f'https://{b["slug"]}.io', 'twitter': f'https://twitter.com/{b["slug"]}'}
        b['riskScore'] = 15
        projects.append(b)
        slugs.add(b['slug'])

p_file.write_text(json.dumps(projects, indent=2, ensure_ascii=False), encoding='utf-8')
print(f'Total projects in store: {len(projects)}')
