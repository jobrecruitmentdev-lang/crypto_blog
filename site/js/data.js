// Mock data — replace with API calls to a real backend later.
const AIRDROPS = [
  {slug:"gmgn", name:"GMGN", chain:"Robinhood Chain", status:["Ongoing"], reward:"$500-$3000", difficulty:"Easy", time:"25 min/week", heat:52, desc:"Multi-chain meme token trading terminal with copy trading and smart-money tracking.", tags:["Trading","DeFi"]},
  {slug:"privacy-pools", name:"Privacy Pools", chain:"Ethereum", status:["Ongoing"], reward:"$200-$800", difficulty:"Medium", time:"15 min", heat:38, desc:"Generate entropy, complete contribution and deposit for privacy-preserving pools.", tags:["Privacy","Ethereum"]},
  {slug:"legend", name:"Legend", chain:"Solana", status:["Ongoing"], reward:"$300-$1200", difficulty:"Easy", time:"10 min", heat:41, desc:"Sign up, deposit, trade and refer users on this fast-growing platform.", tags:["Trading","Solana"]},
  {slug:"ducat", name:"Ducat", chain:"Base", status:["Ongoing"], reward:"TBA", difficulty:"Easy", time:"5 min", heat:29, desc:"Join Discord, request and redeem code to participate.", tags:["Discord","Base"]},
  {slug:"arcus", name:"Arcus", chain:"Arbitrum", status:["Ongoing"], reward:"$400-$1500", difficulty:"Medium", time:"20 min", heat:492, desc:"Sign up, join waitlist and trade spot markets on Arcus.", tags:["Trading","L2"]},
  {slug:"solpump", name:"SolPump", chain:"Solana", status:["Ongoing"], reward:"$50-$300", difficulty:"Easy", time:"5 min/hr", heat:411, desc:"Participate hourly to grab free SOL rewards.", tags:["Solana","Gaming"]},
  {slug:"ondo-perps", name:"Ondo Perps", chain:"Ethereum", status:["Ongoing","Confirmed"], reward:"$1000+", difficulty:"Medium", time:"30 min", heat:301, desc:"Join and start trading perpetuals with confirmed token rewards.", tags:["DeFi","Confirmed"]},
  {slug:"hypertrade", name:"Hypertrade", chain:"Base", status:["Ongoing"], reward:"$300-$900", difficulty:"Easy", time:"15 min", heat:276, desc:"Make swaps and add liquidity to earn potential allocation.", tags:["DeFi","Base"]},
  {slug:"3jane", name:"3Jane", chain:"Ethereum", status:["Ongoing","Confirmed"], reward:"$200-$700", difficulty:"Easy", time:"10 min", heat:24, desc:"Supply USDC to the protocol for confirmed reward eligibility.", tags:["DeFi","Stablecoin"]},
  {slug:"hoodtracker", name:"HoodTracker", chain:"Robinhood Chain", status:["Ongoing","Confirmed"], reward:"$150-$600", difficulty:"Easy", time:"10 min", heat:19, desc:"Connect X, complete social tasks and hold HDTX tokens.", tags:["Social","Robinhood Chain"]},
  {slug:"monad", name:"Monad", chain:"Monad", status:["Ongoing","Confirmed"], reward:"$500-$5000", difficulty:"Medium", time:"20 min", heat:145, desc:"Explore mainnet features across the high-performance L1.", tags:["L1","Confirmed"]},
  {slug:"jupiter", name:"Jupiter", chain:"Solana", status:["Ongoing","Confirmed"], reward:"Claim Live", difficulty:"Easy", time:"5 min", heat:88, desc:"Stake JUP to be eligible for ongoing JUP airdrops.", tags:["Solana","Confirmed"]},
];

const CATEGORIES = [
  {name:"Ethereum", icon:"⟠", count:128},
  {name:"Solana", icon:"◎", count:96},
  {name:"Layer 2", icon:"🧱", count:74},
  {name:"DeFi", icon:"💧", count:112},
  {name:"Gaming", icon:"🎮", count:53},
  {name:"AI", icon:"🤖", count:61},
  {name:"NFT", icon:"🖼️", count:47},
  {name:"Wallet", icon:"👛", count:38},
  {name:"Exchange", icon:"🏦", count:44},
  {name:"Bitcoin", icon:"₿", count:22},
];

const TICKER = [
  {sym:"BTC", price:"$64,210", chg:"+1.8%", up:true},
  {sym:"ETH", price:"$3,412", chg:"+2.4%", up:true},
  {sym:"SOL", price:"$168.20", chg:"-0.9%", up:false},
  {sym:"BNB", price:"$592.10", chg:"+0.6%", up:true},
  {sym:"DOGE", price:"$0.142", chg:"-1.2%", up:false},
  {sym:"XRP", price:"$0.612", chg:"+3.1%", up:true},
];

const BLOG_POSTS = [
  {tag:"Guide", title:"How to Farm Airdrops Safely in 2026", excerpt:"A practical checklist for wallet hygiene, sybil avoidance and snapshot timing.", date:"Jul 14, 2026", read:"6 min",
    body:`<p>Farming airdrops safely starts with wallet separation. Never use a wallet holding significant funds to interact with unaudited testnets or new protocols.</p>
    <p>Sybil detection has become far more sophisticated. Projects now cross-reference wallet funding sources, transaction timing patterns, and behavioral similarity across addresses. Avoid funding multiple wallets from the same source in rapid succession.</p>
    <p>Finally, track snapshot announcements closely — many protocols give little to no warning before a snapshot, so consistent baseline activity beats last-minute farming.</p>`},
  {tag:"News", title:"Layer 2 Season: Which Chains Are Rewarding Early Users", excerpt:"Comparing incentive programs across the top rollups this quarter.", date:"Jul 10, 2026", read:"4 min",
    body:`<p>This quarter has seen a wave of Layer 2 incentive programs, from points systems to direct fee rebates. We break down which rollups have the clearest path to a token and which are already confirmed.</p>
    <p>Bridging volume, sustained activity, and governance participation remain the strongest signals across every program we've tracked.</p>`},
  {tag:"Guide", title:"Retroactive Airdrops Explained", excerpt:"Why protocols reward historical usage and how to position for it.", date:"Jul 5, 2026", read:"5 min",
    body:`<p>Retroactive airdrops reward users for activity that happened before any announcement, which is what makes early, genuine usage so valuable.</p>
    <p>Uniswap's UNI distribution set the template: any wallet that interacted with the protocol before a snapshot qualified. Since then, dozens of DeFi protocols have followed suit.</p>
    <p>The best strategy is simple — use products you'd use anyway, across multiple chains, and let the retroactive rewards be a bonus rather than the goal.</p>`},
];

const GUIDES = [
  {title:"Setting Up a Farming Wallet", level:"Beginner", desc:"Create and secure a dedicated wallet for airdrop farming, separate from your main holdings.",
    body:`<p>Start with a fresh seed phrase generated offline, ideally on a hardware wallet. Never reuse a seed phrase across a "safe" wallet and a farming wallet.</p>
    <p>Fund the wallet with only what you need for gas and task requirements. Keep a spreadsheet of which protocols you've interacted with and when.</p>
    <p>Consider a small number of farming wallets (3-5) rather than dozens — quality of activity matters more than wallet count, and too many wallets increases sybil-detection risk.</p>`},
  {title:"Bridging to Layer 2 Networks", level:"Beginner", desc:"A walkthrough of bridging ETH and stablecoins to popular rollups.",
    body:`<p>Official bridges are slower but safest. Third-party bridges like across.to or Hop can be faster and cheaper, and using a mix of both demonstrates broader ecosystem engagement.</p>
    <p>After bridging, don't just sit — interact with at least 2-3 native dApps on the destination chain to build a genuine activity footprint.</p>`},
  {title:"Understanding Snapshot Mechanics", level:"Intermediate", desc:"How token snapshots work and what activity typically counts.",
    body:`<p>A snapshot is a recorded state of on-chain activity or balances at a specific block height. Projects rarely announce the exact block in advance to prevent last-minute farming.</p>
    <p>Common snapshot criteria include transaction count, volume, unique days active, governance votes, and referral activity. Consistency across weeks outperforms a single burst of activity.</p>`},
  {title:"Avoiding Sybil Detection", level:"Advanced", desc:"Best practices for wallet behavior that reduce the risk of being flagged.",
    body:`<p>Avoid funding multiple wallets from the same centralized exchange withdrawal in a tight time window. Stagger funding and interaction timing.</p>
    <p>Vary transaction amounts and timing naturally — bots and farms often produce suspiciously uniform patterns that on-chain analytics firms can detect.</p>`},
];

const FAQS = [
  {q:"What are crypto airdrops?", a:"Airdrops are free token distributions from blockchain projects to reward early users, holders, or community members for specific actions."},
  {q:"How do I get free crypto airdrops?", a:"Complete tasks like signing up, connecting a wallet, trading, or joining a community — then follow the project until any snapshot or claim window opens."},
  {q:"Are airdrops safe?", a:"Most are safe if you use a dedicated wallet, never share your private key, and verify official project links before connecting."},
  {q:"How do I find upcoming airdrops?", a:"Check aggregators like this site regularly, follow official project social accounts, and monitor new protocol launches and testnets."},
];
