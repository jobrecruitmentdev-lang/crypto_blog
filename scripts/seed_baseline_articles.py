import os
import sys
import json
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.append(str(Path(__file__).resolve().parent.parent))

from automation.modules.ai_image_engine import generate_8k_image

articles_file = Path('web/src/data/articles.json')
articles = []
if articles_file.exists():
    try:
        articles = json.loads(articles_file.read_text(encoding='utf-8'))
    except Exception:
        articles = []

existing_slugs = {a.get('slug') for a in articles}

SEED_ARTICLES = [
    # 1. INTELLIGENCE
    {
        "slug": "berachain-v2-proof-of-liquidity-tge-breakdown-2026",
        "pageType": "intelligence",
        "tag": "Market Intelligence",
        "title": "Berachain V2 Boyco & Proof of Liquidity: TGE Mechanics & Valuation Model",
        "excerpt": "Comprehensive on-chain valuation model dissecting Berachain Proof of Liquidity (PoL), tri-token flywheel dynamics, and Boyco vault allocation math.",
        "tldr": "Berachain aligns network security with decentralized liquidity through Proof of Liquidity. BGT delegators earn ecosystem bribe yield while securing EVM block space.",
        "keyTakeaways": [
            "Proof of Liquidity directs validator emissions into productive DEX liquidity rather than idle capital lockup.",
            "Soulbound BGT governance token cannot be purchased directly on secondary exchanges.",
            "Boyco pre-deposits via Royco protocol unlock guaranteed allocations from over 30 leading ecosystem projects.",
            "Tri-token separation (BERA, BGT, HONEY) prevents governance capture and stabilizes gas pricing."
        ],
        "date": "2026-08-28",
        "updatedAt": "2026-09-02",
        "read": "11 min read",
        "authorSlug": "ai-intelligence-engine",
        "body": """
        <h2>1. Foundational Proof of Liquidity Architecture</h2>
        <p>Proof of Stake networks historically suffer from a fundamental capital allocation dilemma: capital allocated to consensus security is sequestered away from decentralized finance protocols, creating artificial liquidity scarcity. Berachain's Proof of Liquidity (PoL) consensus resolves this by mandating that validators direct emission weights exclusively toward productive, whitelisted decentralized exchange pools.</p>
        <p>Under PoL, validators do not stake the native gas token ($BERA) directly to accumulate consensus weight. Instead, liquidity providers deposit assets into PoL-whitelisted liquidity pools on the native decentralized exchange (BEX), generating non-transferable Bera Governance Tokens ($BGT). Liquidity providers then delegate their accumulated BGT to active network validators.</p>
        
        <h2>2. Tri-Token Economic Flywheel Breakdown</h2>
        <p>Berachain decouples the traditional unified utility token into three distinct economic instruments:</p>
        <table>
            <thead>
                <tr><th>Token Asset</th><th>Classification</th><th>Primary Function</th><th>Economic Velocity</th></tr>
            </thead>
            <tbody>
                <tr><td><strong>$BERA</strong></td><td>Gas Asset</td><td>Transaction execution & block space fees</td><td>High velocity / Burn mechanics</td></tr>
                <tr><td><strong>$BGT</strong></td><td>Soulbound Governance</td><td>Validator emission weights & proposal voting</td><td>Zero secondary velocity (Non-transferable)</td></tr>
                <tr><td><strong>$HONEY</strong></td><td>Collateralized Stablecoin</td><td>Decentralized margin, lending & settlement</td><td>Medium velocity / 100% reserve backing</td></tr>
            </tbody>
        </table>

        <h2>3. Boyco & Pre-Mainnet Vault Dynamics</h2>
        <p>The Boyco initiative orchestrated via Royco Protocol establishes an unprecedented pre-deposit liquidity coordination model. Liquidity providers committing capital to whitelisted Boyco vaults prior to Genesis block execution receive upfront guaranteed allocations from over 30 distinct decentralized applications.</p>
        <p>This coordinated pre-liquidity architecture guarantees that Berachain mainnet launches with hundreds of millions in native liquidity depth from day one, mitigating early slippage and ensuring robust derivatives trading on Berps.</p>

        <h2>4. On-Chain Sybil Filtering & Valuation Outlook</h2>
        <p>Institutional modeling indicates that Berachain's fully diluted valuation (FDV) at Token Generation Event will heavily reward multi-contract interaction depth. Users who diversified actions across BEX (DEX), Bend (Lending), Berps (Perpetuals), and the Honey minting contract demonstrate non-sybil organic behaviors.</p>
        """,
        "faqs": [
            {"question": "Can BGT be traded on centralized exchanges?", "answer": "No. BGT is an ERC-20 soulbound token that cannot be transferred or traded. It can only be burned 1:1 for liquid BERA."},
            {"question": "What is the primary driver of BGT delegation yield?", "answer": "Validators distribute ecosystem bribe rewards (in stablecoins and protocol tokens) to attract BGT delegation from liquidity providers."},
            {"question": "How does HONEY maintain its $1.00 peg?", "answer": "HONEY is 100% collateralized by basket stablecoins (STGUSDC, USDT) through automated mint and redeem smart contract arbitrage."}
        ]
    },
    # 2. METHODOLOGY
    {
        "slug": "5-stage-smart-contract-audit-telemetry-framework",
        "pageType": "methodology",
        "tag": "Security Framework",
        "title": "The 5-Stage Smart Contract Audit & Risk Evaluation Standard",
        "excerpt": "A formal technical treatise on Crypto Airdrop AI's proprietary 5-stage verification methodology, attack vector filtering, and honeypot risk matrices.",
        "tldr": "Every protocol cataloged by Crypto Airdrop AI undergoes a non-custodial 5-stage telemetry audit examining bytecode integrity, proxy ownership, and withdrawal liquidity.",
        "keyTakeaways": [
            "Stage 1 enforces verifiable cryptographic domain and source code attestation.",
            "Stage 2 executes bytecode simulation on isolated EVM test nodes to track approval scopes.",
            "Stage 3 evaluates multisig threshold requirements and proxy upgrade delay timelocks.",
            "Stage 4 calculates liquidity lock permanence and emergency withdrawal circuit breakers."
        ],
        "date": "2026-08-15",
        "updatedAt": "2026-09-01",
        "read": "12 min read",
        "authorSlug": "security-sentinel-ai",
        "body": """
        <h2>1. The Necessity of Algorithmic Web3 Verification</h2>
        <p>The cryptocurrency token distribution landscape is inundated with predatory clone portals, malicious proxy contracts, and deceptive phishing drainage vectors. Traditional social-sentiment research is entirely inadequate against sophisticated sybil traps and malicious approval exploits. Crypto Airdrop AI establishes a non-negotiable 5-stage cryptographic evaluation standard applied to every cataloged decentralized application.</p>

        <h2>2. Detailed 5-Stage Evaluation Telemetry Matrix</h2>
        <table>
            <thead>
                <tr><th>Stage</th><th>Audit Focus</th><th>Execution Methodology</th><th>Automated Failure Trigger</th></tr>
            </thead>
            <tbody>
                <tr><td><strong>Stage 1</strong></td><td>Cryptographic Attestation</td><td>DNSSEC validation & verified developer commit signatures</td><td>Unverified DNS proxy or new domain registration (&lt;60d)</td></tr>
                <tr><td><strong>Stage 2</strong></td><td>Bytecode Simulation</td><td>Static AST parsing & trace execution in isolated sandbox</td><td>Hidden transferFrom() logic or excessive allowance requests</td></tr>
                <tr><td><strong>Stage 3</strong></td><td>Proxy & Governance</td><td>Timelock inspection & multisig threshold analysis</td><td>Single-key admin without timelock queue</td></tr>
                <tr><td><strong>Stage 4</strong></td><td>Liquidity Permanence</td><td>LP token burn verification & time-lock contract audit</td><td>Unlocked creator liquidity or dynamic mint functions</td></tr>
                <tr><td><strong>Stage 5</strong></td><td>Human Peer Review</td><td>Final editorial walkthrough & plain-language risk report</td><td>Vague token distribution claims or unverified roadmap</td></tr>
            </tbody>
        </table>

        <h2>3. Infinite Approval Traps & Permit2 Decompilation</h2>
        <p>Stage 2 automated crawlers specifically isolate ERC-20 <code>approve()</code> and Uniswap <code>Permit2</code> signatures. Malicious contracts frequently request unlimited allowance access, allowing malicious operators to sweep wallets long after the initial interaction. Our protocol assigns a critical failure score to any interaction demanding broad allowance scopes beyond the exact transaction amount.</p>

        <h2>4. Non-Custodial Guarantee & Scoring Formula</h2>
        <p>Crypto Airdrop AI operates under a strict non-custodial mandate: our research desk never requests private keys, never connects wallet signers for custodial deposit, and maintains 100% read-only blockchain telemetry. The Risk Score (0–100) represents the compound probability of smart contract exploit or financial loss.</p>
        """,
        "faqs": [
            {"question": "How often are verified protocol contracts re-evaluated?", "answer": "Smart contract addresses are scanned automatically every 72 hours for proxy implementation upgrades or ownership transfer transactions."},
            {"question": "What is an immediate disqualification trigger?", "answer": "Any protocol utilizing unverified bytecode, lack of public audit reports from tier-1 firms, or centralized single-key upgrade proxies is immediately delisted."},
            {"question": "Can projects pay to bypass the 5-Stage Audit?", "answer": "No. Under our strict Editorial Integrity Charter, zero paid listings or sponsored bypasses are permitted."}
        ]
    },
    # 3. EDITORIAL
    {
        "slug": "editorial-integrity-charter-and-fact-checking-code",
        "pageType": "editorial",
        "tag": "Editorial Integrity",
        "title": "Crypto Airdrop AI Editorial Charter & Fact-Checking Standards",
        "excerpt": "Our binding ethical code governing non-financial advice declarations, conflict-of-interest disclosures, zero-shilling policies, and corrections SLAs.",
        "tldr": "We uphold uncompromising journalistic standards: zero sponsored airdrop reviews, verified source verification, and transparent corrections accountability.",
        "keyTakeaways": [
            "Strict separation between editorial research and any token holding positions.",
            "Zero sponsored or paid listing inclusions across the primary airdrop directory.",
            "24-hour mandatory SLA for factual corrections regarding snapshot dates or instructions.",
            "All step walkthroughs replicated directly on live testnets prior to documentation."
        ],
        "date": "2026-08-10",
        "updatedAt": "2026-08-26",
        "read": "10 min read",
        "authorSlug": "editorial-desk",
        "body": """
        <h2>1. Foundational Editorial Purpose & Independence</h2>
        <p>Crypto Airdrop AI was created to restore factual rigor, technical accuracy, and unbiased analysis to Web3 token discovery. In an industry compromised by paid promotional influencer shilling and deceptive referral schemes, our editorial desk enforces strict institutional ethics modeled after the Society of Professional Journalists (SPJ) and IEEE engineering review standards.</p>

        <h2>2. Core Journalistic Principles</h2>
        <ul>
            <li><strong>Zero Paid Shilling:</strong> We do not accept payment, tokens, equity, or sponsorship from protocols seeking inclusion in our directory or market intelligence reports.</li>
            <li><strong>Replicated Step Walkthroughs:</strong> No step-by-step farming guide is published based solely on promotional press releases. Every single transaction path must be executed directly by our test nodes on public testnets or mainnets.</li>
            <li><strong>Explicit Non-Financial Advice:</strong> Token distributions carry regulatory, tax, and volatility risks. All content is strictly educational and does not constitute investment advice.</li>
            <li><strong>Mandatory Conflict of Interest Disclosures:</strong> If an author or analyst holds an allocation or token position in an evaluated protocol, full disclosure is mandatory at the top of the publication.</li>
        </ul>

        <h2>3. Transparent Corrections & Retraction SLA</h2>
        <p>Token snapshot windows, contract addresses, and network parameters evolve rapidly. Crypto Airdrop AI enforces a strict 24-hour SLA on all factual correction submissions. Readers and protocol teams can submit verifiable corrections directly to <code>editorial@cryptoairdropai.com</code>.</p>
        """,
        "faqs": [
            {"question": "How are editorial guidelines enforced?", "answer": "All publications require dual sign-off from both a Technical Security Sentinel and the Chief Standards Editor prior to git commit and deployment."},
            {"question": "Does Crypto Airdrop AI operate referral links?", "answer": "Where public referral codes are utilized, they are explicitly tagged with full transparency and zero impact on objective risk scoring."},
            {"question": "Where can corrections be submitted?", "answer": "Factual corrections are processed via our dedicated editorial portal at /contact/ with a guaranteed 24-hour turnaround."}
        ]
    }
]

for s in SEED_ARTICLES:
    slug = s['slug']
    if slug not in existing_slugs:
        # Generate 8K images
        images = {
            "featured_image": generate_8k_image(s["title"], slug, placement="featured"),
            "middle_image": generate_8k_image(s["title"], slug, placement="middle"),
            "pre_faq_image": generate_8k_image(s["title"], slug, placement="pre_faq")
        }
        s["featuredImage"] = images["featured_image"]
        s["middleImage"] = images["middle_image"]
        s["preFaqImage"] = images["pre_faq_image"]
        articles.append(s)
        existing_slugs.add(slug)
        print(f"[+] Seeded article with 8K images: {slug} ({s['pageType']})")

articles_file.write_text(json.dumps(articles, indent=2, ensure_ascii=False), encoding='utf-8')
print(f"[+] Total articles in database: {len(articles)}")
