import psycopg2
import json
from datetime import datetime

# Supabase Connection Parameters
DB_CONFIG = {
    'host': 'aws-0-ap-northeast-1.pooler.supabase.com',
    'port': 6543,
    'user': 'postgres.oebuqronflnytkdyckxi',
    'password': '9^VGH+Wff&#qtGy',
    'dbname': 'postgres',
    'sslmode': 'require'
}

SQL_SCHEMA = """
-- 1. Create Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    tldr TEXT,
    body TEXT NOT NULL,
    category TEXT DEFAULT 'Crypto Airdrops',
    read_time TEXT DEFAULT '5 min',
    author_name TEXT DEFAULT 'Editorial Desk',
    author_slug TEXT DEFAULT 'editorial-desk',
    cover_image_url TEXT,
    faqs JSONB DEFAULT '[]'::jsonb,
    key_takeaways JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'published',
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at DESC);

-- 3. Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 4. Create Public Read Policy (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'posts' AND policyname = 'Public Read Published Posts'
    ) THEN
        CREATE POLICY "Public Read Published Posts" 
        ON public.posts 
        FOR SELECT 
        USING (status = 'published');
    END IF;
END $$;
"""

# Initial Seed Data
SEED_POSTS = [
    {
        "slug": "how-to-farm-airdrops-safely-2026",
        "title": "How to Farm Crypto Airdrops Safely in 2026: Multi-Wallet Security & Sybil Defense",
        "excerpt": "Comprehensive operational security guidelines for airdrop participants: multi-wallet architecture, RPC endpoints, contract approvals, and mitigating on-chain clustering.",
        "tldr": "Airdrop farming in 2026 demands strict operational security. Use isolated burn-wallets for unverified dApps, never reuse seed phrases across testnets, and avoid symmetrical funding patterns to bypass heuristic sybil detection.",
        "category": "Security Guide",
        "read_time": "6 min read",
        "author_name": "Crypto Airdrop AI Security Sentinel",
        "author_slug": "security-sentinel-ai",
        "key_takeaways": [
            "Maintain strict separation between primary vault hardware wallets and active interaction burn-wallets.",
            "Use decentralized RPC providers to prevent IP and geolocation correlation across multi-wallet setups.",
            "Regularly revoke smart contract allowances via verified tools like Revoke.cash.",
            "Fund wallets via sub-accounts or variable CEX withdrawal amounts to defeat graph-clustering anti-sybil filters."
        ],
        "faqs": [
            {"question": "How many wallets should I use for airdrop farming?", "answer": "For individual participants, maintaining 3 to 5 isolated wallets with distinct funding histories and randomized interaction schedules is optimal."},
            {"question": "Can protocols detect if I use multiple wallets from the same device?", "answer": "Yes, if dApps collect frontend telemetry, browser fingerprinting, or IP addresses. Use separate browser profiles and varied connection methods."},
            {"question": "How often should I revoke token approvals?", "answer": "Revoke unlimited token approvals immediately after completing testnet or protocol interactions, or at minimum once monthly."}
        ],
        "body": """<h2>The New Era of Crypto Airdrops: Risk vs. Opportunity</h2>
<p>As the crypto ecosystem matures into 2026, retroactive token distributions have evolved from simple marketing giveaways into highly sophisticated token distribution mechanisms. While the potential upside remains substantial, the operational risks—ranging from malicious phishing drainers to aggressive anti-sybil algorithmic filtering—have increased exponentially.</p>

<h2>1. The Multi-Tier Wallet Architecture</h2>
<p>Never interact with unverified smart contracts or testnet dApps using your primary vault wallet. Implement a strict three-tier architecture:</p>
<ul>
    <li><strong>Cold Vault:</strong> Hardware wallet holding long-term assets with zero smart contract approvals.</li>
    <li><strong>Staging Wallet:</strong> Used for intermediate transfers and funding active accounts.</li>
    <li><strong>Burner Interaction Wallets:</strong> Dedicated accounts for testnet executions, swaps, and dApp interactions.</li>
</ul>

<h2>2. Defeating Algorithmic Sybil Detection</h2>
<p>Modern anti-sybil engines (such as those employed by LayerZero, Arbitrum, and Gitcoin) analyze on-chain clustering. To maintain organic status:</p>
<ul>
    <li>Randomize transaction timing and days of the week.</li>
    <li>Avoid funding multiple wallets with identical amounts from the same source address.</li>
    <li>Maintain variable transaction volume and interact with diverse DeFi protocols.</li>
</ul>"""
    },
    {
        "slug": "monad-ecosystem-airdrop-playbook-2026",
        "title": "Monad Ecosystem & Parallel EVM Airdrop Playbook: Complete Testnet & Early Positioning Guide",
        "excerpt": "An exhaustive technical walkthrough of Monad's 10,000 TPS parallelized EVM architecture, testnet faucet strategies, ecosystem dApps, and validator delegation positioning.",
        "tldr": "Monad delivers 10,000 TPS via parallelized EVM execution and MonadBFT consensus. Early testnet participation, organic smart contract interactions on ecosystem DEXs, and community verification offer the highest weighting for potential token distribution.",
        "category": "Ecosystem Alpha",
        "read_time": "6 min read",
        "author_name": "Crypto Airdrop AI Intelligence Engine",
        "author_slug": "ai-intelligence-engine",
        "key_takeaways": [
            "Monad achieves 10,000 TPS through superscalar pipelining and optimistic parallel transaction execution.",
            "Testnet participation with native DEXs, lending markets, and liquid staking creates crucial on-chain records.",
            "Community Discord roles and verified developer activity provide critical non-sybil weighting.",
            "Never pay for testnet faucets; rely strictly on official community faucet channels."
        ],
        "faqs": [
            {"question": "What is Monad's expected mainnet timeline?", "answer": "Monad is progressing through incentivized testnet phases with public mainnet deployment expected in the latter half of 2026."},
            {"question": "Do I need real ETH to test Monad?", "answer": "No, Monad testnet utilizes free testnet tokens distributed through official faucets and community channels."},
            {"question": "Which wallets support Monad?", "answer": "All standard EVM-compatible wallets including MetaMask, Rabby, and Phantom support Monad via custom RPC configuration."}
        ],
        "body": """<h2>Understanding Monad's 10,000 TPS Parallel EVM Architecture</h2>
<p>Monad is a layer-1 smart contract platform that re-engineers Ethereum Virtual Machine (EVM) execution. By decoupling execution from consensus and leveraging optimistic parallel scheduling, Monad achieves 10,000 transactions per second with single-slot finality.</p>

<h2>Step-by-Step Testnet Positioning Strategy</h2>
<ol>
    <li><strong>RPC Configuration:</strong> Add the official Monad testnet chain ID to your Rabby or MetaMask wallet.</li>
    <li><strong>Faucet Acquisition:</strong> Request testnet MON tokens from verified official faucets.</li>
    <li><strong>DEX Swapping:</strong> Execute token swaps and supply liquidity on early ecosystem decentralized exchanges.</li>
    <li><strong>Lending & Liquid Staking:</strong> Interact with money markets and test liquid staking derivatives.</li>
    <li><strong>Consistent Activity:</strong> Perform weekly transactions across diverse ecosystem contracts rather than a single bulk session.</li>
</ol>"""
    },
    {
        "slug": "top-confirmed-crypto-airdrops-2026-calendar",
        "title": "Top Confirmed Crypto Airdrops of 2026: Official Snapshot Dates, Tokenomics & Criteria Checklist",
        "excerpt": "A curated radar of verified, confirmed 2026 token distributions—including Ondo Perps, Monad, Privacy Pools, and 3Jane—with audited smart contracts and snapshot requirements.",
        "tldr": "2026 features major confirmed token distributions from established protocols. Projects are prioritizing liquidity providers, long-term governance stakers, and verified smart contract testnet users with transparent vesting cliffs.",
        "category": "Airdrop Calendar",
        "read_time": "5 min read",
        "author_name": "Crypto Airdrop AI Editorial Desk",
        "author_slug": "editorial-desk",
        "key_takeaways": [
            "Confirmed airdrops provide guaranteed token distribution upon Token Generation Event (TGE), eliminating speculative risk.",
            "Ondo Perps, 3Jane, and Jupiter have published verified governance allocations in their official documentation.",
            "Maintain active on-chain presence before official snapshot block heights are locked.",
            "Double-check official contract addresses to avoid phishing clone tokens."
        ],
        "faqs": [
            {"question": "What distinguishes a confirmed airdrop from a potential airdrop?", "answer": "A confirmed airdrop has official foundation documentation or audited smart contract tokenomics specifying a community token distribution pool."},
            {"question": "When will 2026 confirmed airdrops be claimable?", "answer": "Claim windows open upon each protocol's respective Token Generation Event (TGE), usually spanning 30 to 90 days."},
            {"question": "Do confirmed airdrops require KYC verification?", "answer": "Most decentralized DeFi protocols distribute rewards purely based on on-chain wallet state without KYC, though centralized launchpads may impose regional restrictions."}
        ],
        "body": """<h2>Verified 2026 Token Distribution Landscape</h2>
<p>Unlike speculative retroactive farming, confirmed airdrops have publicly published token allocation percentages reserved for early community participants, testnet users, and liquidity providers.</p>

<h2>Featured Confirmed Distributions</h2>
<h3>1. Ondo Perps</h3>
<p>Ondo Finance perpetual market participants earn allocation points based on trading volume, open interest, and liquidity provision.</p>

<h3>2. 3Jane DeFi</h3>
<p>Supplying USDC to 3Jane automated lending pools confirms baseline tier eligibility for upcoming protocol governance governance distributions.</p>

<h3>3. Jupiter Governance Staking (Round 2)</h3>
<p>Active stakers who participate in governance proposals and vote on ecosystem launchpad tokens are verified for subsequent JUP distribution rounds.</p>"""
    }
]

def run_migration():
    print("[*] Connecting to Supabase PostgreSQL 17.6...")
    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = True
    cur = conn.cursor()

    print("[*] Executing Schema Migration...")
    cur.execute(SQL_SCHEMA)
    print("[+] Schema & RLS policies created successfully!")

    print("[*] Seeding Initial Articles...")
    for post in SEED_POSTS:
        cur.execute("""
            INSERT INTO public.posts (
                slug, title, excerpt, tldr, body, category, read_time,
                author_name, author_slug, faqs, key_takeaways, status,
                published_at, created_at, updated_at
            ) VALUES (
                %(slug)s, %(title)s, %(excerpt)s, %(tldr)s, %(body)s, %(category)s, %(read_time)s,
                %(author_name)s, %(author_slug)s, %(faqs)s, %(key_takeaways)s, 'published',
                now(), now(), now()
            )
            ON CONFLICT (slug) DO UPDATE SET
                title = EXCLUDED.title,
                excerpt = EXCLUDED.excerpt,
                tldr = EXCLUDED.tldr,
                body = EXCLUDED.body,
                category = EXCLUDED.category,
                read_time = EXCLUDED.read_time,
                author_name = EXCLUDED.author_name,
                author_slug = EXCLUDED.author_slug,
                faqs = EXCLUDED.faqs,
                key_takeaways = EXCLUDED.key_takeaways,
                updated_at = now();
        """, {
            **post,
            'faqs': json.dumps(post['faqs']),
            'key_takeaways': json.dumps(post['key_takeaways'])
        })
        print(f"  [+] Seeded/Updated post: {post['slug']}")

    # Count rows
    cur.execute("SELECT COUNT(*) FROM public.posts;")
    count = cur.fetchone()[0]
    print(f"\n[SUCCESS] Supabase Migration Complete! Total posts in table: {count}")

    cur.close()
    conn.close()

if __name__ == '__main__':
    run_migration()
