import Link from "next/link";
import Image from "next/image";
import BlogGrid from "@/components/BlogGrid";
import Newsletter from "@/components/Newsletter";
import FilterableGrid from "@/components/FilterableGrid";
import FaqAccordion from "@/components/FaqAccordion";
import AirdropCalculator from "@/components/AirdropCalculator";
import { GUIDES } from "@/lib/data";
import { getAllPosts } from "@/lib/cms/blogService";
import { getProjects, getArticles } from "@/lib/contentStore";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";
import HomeTickerStrip from "@/components/HomeTickerStrip";
import initialTickerData from "@/data/ticker.json";

export default async function Home() {
  const [allPosts, allProjects, guideArticles, methodologyArticles] = await Promise.all([
    getAllPosts(),
    getProjects(),
    getArticles("guides"),
    getArticles("methodology"),
  ]);

  const featuredPost = allPosts[0];
  const otherPosts = allPosts.length > 1 ? allPosts.slice(1, 7) : allPosts;
  const activeGuides = guideArticles.length > 0 ? guideArticles : GUIDES;

  const homeFaqs = [
    {
      question: "What is Crypto Airdrop AI and how are projects verified?",
      answer: "Crypto Airdrop AI is an independent Web3 research portal tracking verified token distributions across 50+ blockchains. Deployments undergo our 5-Stage Audit Framework: bytecode decompilation, multi-sig timelock checks, treasury analysis, tokenomics distribution modeling, and RPC simulation to filter out malicious drainers."
    },
    {
      question: "What is a crypto airdrop and how do users receive free crypto?",
      answer: "A crypto airdrop is a distribution mechanism where blockchain networks and decentralized protocols distribute free native tokens or governance rights directly to eligible Web3 wallet addresses. Airdrops reward early adopters, testnet node operators, protocol testers, and liquidity providers prior to an official Token Generation Event (TGE)."
    },
    {
      question: "How do I farm crypto airdrops safely without being flagged as a sybil?",
      answer: "Implement strict 3-tier wallet hygiene: isolate primary cold storage from active dApps, fund burner accounts from exchange sub-accounts at staggered intervals, and maintain continuous weekly interactions across diverse smart contracts rather than single-day burst farming."
    },
    {
      question: "Are testnet crypto airdrops completely free?",
      answer: "Yes. Testnet airdrops operate on simulated blockchain networks (such as Berachain, Story Protocol, or Monad) using free faucet gas tokens. They require zero monetary investment other than standard operational interaction time."
    },
    {
      question: "How can I avoid crypto airdrop scams and wallet drainers?",
      answer: "Never enter your 12 or 24-word seed phrase or private keys into any website. Always verify smart contract addresses via official block explorers, use dedicated burner wallets with strictly limited capital, and revoke dApp approvals immediately after farming interactions using tools like Revoke.cash."
    },
    {
      question: "Does Crypto Airdrop AI accept paid promotions or sponsored listings?",
      answer: "No. Crypto Airdrop AI operates under a strict Non-Custodial & Zero-Sponsorship charter. We do not accept paid compensation or token allocations from featured projects, ensuring 100% objective technical analysis."
    }
  ];

  const homeFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://cryptoairdropai.com/#faq",
    "mainEntity": homeFaqs.map((f) => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }} />

      {/* CoinDesk Style Live Market Ticker Strip */}
      <HomeTickerStrip 
        initialTicker={initialTickerData.ticker} 
        initialAlphaDispatch={initialTickerData.alphaDispatch} 
      />

      {/* Primary Authoritative Master Header & Breadcrumb Silo */}
      <section className="section" style={{ padding: "32px 0 0" }}>
        <div className="wrap">
          <MotionFade delay={0.05} direction="up" style={{ marginBottom: 28 }}>
            <div style={{ display: "inline-flex", marginBottom: 10 }}>
              <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)", fontWeight: 800 }}>
                ⚡ Independent Web3 Research Portal
              </span>
            </div>
            <h1 style={{ fontSize: "2.6rem", fontWeight: 800, letterSpacing: "-0.025em", color: "var(--text-bright)", fontFamily: "var(--font-serif)", margin: "0 0 10px", lineHeight: 1.2 }}>
              Verified Crypto Airdrops 2026 — On-Chain Intelligence &amp; Farming Playbooks
            </h1>
            <p style={{ fontSize: "1.1rem", color: "var(--text)", maxWidth: 820, lineHeight: 1.65, opacity: 0.88, margin: 0 }}>
              Autonomous RPC tracking, Sybil cluster defense, and on-chain snapshot verification across 50+ Web3 ecosystems. Zero sponsored rankings. 100% non-custodial research.
            </p>
          </MotionFade>
        </div>
      </section>

      {/* CoinDesk Media Bento Hero Section */}
      <section className="section" style={{ padding: "20px 0 28px" }}>
        <div className="wrap">
          <div className="hero-bento">
            
            {/* Left Primary Lead Story (65% Width) */}
            <MotionCard 
              style={{ 
                padding: 0, 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between", 
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                overflow: "hidden"
              }}
            >
              {/* 8K Featured Hero Media */}
              <div 
                style={{ 
                  position: "relative", 
                  width: "100%", 
                  aspectRatio: "21/9", 
                  background: "var(--surface-sunken)", 
                  borderBottom: "1px solid var(--border)",
                  overflow: "hidden"
                }}
              >
                <Image
                  src={
                    (featuredPost as any)?.featuredImage || 
                    (featuredPost as any)?.coverImage || 
                    "/images/generated/berachain-v2-proof-of-liquidity-tge-breakdown-2026-featured.jpg"
                  }
                  alt={featuredPost ? featuredPost.title : "Crypto Airdrop Intelligence"}
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 65vw"
                  style={{ objectFit: "cover" }}
                />
                <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
                  <span className="pill-badge" style={{ background: "rgba(255, 255, 255, 0.95)", color: "var(--accent)", fontWeight: 800, fontSize: "0.75rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "1px solid var(--border)" }}>
                    ⚡ FEATURED INTEL REPORT
                  </span>
                </div>
              </div>

              <div style={{ padding: "28px 32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    ON-CHAIN TELEMETRY DISPATCH
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 600 }}>
                    ID: INTEL-2026-08
                  </span>
                </div>
                
                <h2 style={{ fontSize: "1.9rem", lineHeight: 1.25, fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 14, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                  <Link href={featuredPost ? `/blog/${featuredPost.slug}/` : "/blog/"} style={{ color: "inherit", textDecoration: "none" }}>
                    {featuredPost ? featuredPost.title : "The 2026 Decentralized Airdrop Almanac"}
                  </Link>
                </h2>
                
                <p style={{ fontSize: "1.02rem", color: "var(--text)", lineHeight: 1.65, marginBottom: 24, opacity: 0.9 }}>
                  {featuredPost ? featuredPost.excerpt : "Automated RPC tracking, Sybil cluster defense, and on-chain snapshot verifications across 50+ Web3 networks."}
                </p>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <Link href={featuredPost ? `/blog/${featuredPost.slug}/` : "/blog/"} className="btn btn-primary">
                    Read Intelligence Report →
                  </Link>
                  <Link href="/projects/" className="btn btn-outline">
                    Explore Projects Directory →
                  </Link>
                </div>
              </div>

              {/* Telemetry Status Metric Columns */}
              <div className="stats-bento" style={{ padding: "16px 32px 24px", borderTop: "1px solid var(--border-subtle)" }}>
                <div>
                  <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--accent)" }}>50+</div>
                  <div style={{ fontSize: "0.74rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Chains Tracked</div>
                </div>
                <div>
                  <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--emerald)" }}>0-KEYS</div>
                  <div style={{ fontSize: "0.74rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Non-Custodial</div>
                </div>
                <div>
                  <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--amber)" }}>$0 PAID</div>
                  <div style={{ fontSize: "0.74rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Zero Sponsored</div>
                </div>
              </div>
            </MotionCard>

            {/* Right Essential Guides Stack (35% Width) */}
            <MotionCard 
              style={{ 
                padding: 24, 
                display: "flex", 
                flexDirection: "column",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border-subtle)" }}>
                <h2 style={{ fontSize: "1.05rem", fontWeight: 800, margin: 0, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                  Essential Playbooks
                </h2>
                <Link href="/guides/" style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
                  View All ({activeGuides.length}) →
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1, justifyContent: "space-between" }}>
                {activeGuides.slice(0, 4).map((g) => {
                  const guideImg = (g as any).featuredImage || `/images/generated/${g.slug}-featured-v4.jpg` || "/images/generated/solana-multi-wallet-isolation-sybil-defense-masterclass-2026-featured-v2.jpg";
                  return (
                    <Link
                      key={g.slug}
                      href={`/guides/${g.slug}/`}
                      style={{
                        display: "flex",
                        gap: 14,
                        alignItems: "center",
                        padding: "10px 12px",
                        borderRadius: "var(--radius-sm)",
                        background: "var(--surface-sunken)",
                        border: "1px solid var(--border-subtle)",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                      }}
                      className="hover:border-blue-400"
                    >
                      {/* 8K Thumbnail Image */}
                      <div 
                        style={{ 
                          position: "relative", 
                          width: 74, 
                          height: 74, 
                          flexShrink: 0, 
                          borderRadius: 8, 
                          overflow: "hidden", 
                          border: "1px solid var(--border)",
                          background: "var(--bg-alt)"
                        }}
                      >
                        <Image
                          src={guideImg}
                          alt={g.title}
                          fill
                          sizes="74px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>

                      {/* Text details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span className="pill-badge" style={{ fontSize: "0.66rem", padding: "2px 6px", background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>
                            {'level' in g ? g.level : (g.tag || 'Tactical')}
                          </span>
                          <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 500 }}>
                            {'read' in g ? g.read : "6 MIN READ"}
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--text-bright)", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {g.title}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </MotionCard>

          </div>
        </div>
      </section>

      {/* Interactive Telemetry: Airdrop Yield & Sybil Resistance Calculator */}
      <section className="section" style={{ padding: "0 0 16px" }}>
        <div className="wrap">
          <AirdropCalculator />
        </div>
      </section>

      {/* Protocol Scanner Directory Section */}
      <section className="section">
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <span className="pill-badge" style={{ marginBottom: 8, background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>
                📡 PROTOCOL SCANNER
              </span>
              <h2 style={{ fontSize: "1.9rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                Active &amp; Potential Distributions ({allProjects.length})
              </h2>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Link href="/projects/" style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
                View All Projects →
              </Link>
              <Link href="/methodology/" style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 600, textDecoration: "none" }}>
                Audit Methodology →
              </Link>
            </div>
          </div>
          <FilterableGrid airdrops={allProjects} />
        </div>
      </section>

      {/* Master Semantic Knowledge Pillar: What is a Crypto Airdrop? */}
      <section className="section" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)", fontWeight: 700 }}>
                📖 Definitive Web3 Knowledge Pillar
              </span>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginTop: 10, color: "var(--text-bright)", fontFamily: "var(--font-serif)", lineHeight: 1.25 }}>
                What is a Crypto Airdrop? The 2026 Qualification Architecture
              </h2>
              <p style={{ color: "var(--text)", maxWidth: 740, margin: "12px auto 0", fontSize: "1.05rem", lineHeight: 1.65, opacity: 0.9 }}>
                The comprehensive architectural breakdown of decentralized token distributions, anti-sybil clustering defense, and capital-efficient farming across EVM, SVM, and Move ecosystems.
              </p>
            </div>

            {/* Direct AEO Answer Block */}
            <div style={{ padding: "24px 28px", background: "var(--surface-sunken)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", marginBottom: 36, borderLeft: "4px solid var(--accent)" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 8px", color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                Direct Answer: How Crypto Airdrops Function
              </h3>
              <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.7, color: "var(--text)" }}>
                A <strong>crypto airdrop</strong> (also known as a <em>cryptoairdrop</em> or <em>token distribution</em>) is a process where blockchain protocols distribute free native tokens or governance rights directly to Web3 wallet addresses. Rather than conducting an Initial Coin Offering (ICO) or selling tokens exclusively to venture capital syndicates, modern decentralized protocols reward early users who stress-test testnet RPC nodes, provide decentralized exchange (DEX) liquidity, bridge capital, or interact with smart contracts prior to an unannounced on-chain snapshot.
              </p>
            </div>

            {/* Matrix Comparison Table */}
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: 16, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
              Ecosystem Airdrop Archetypes Compared (2026 Telemetry)
            </h3>
            <div style={{ overflowX: "auto", marginBottom: 36 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem", background: "var(--surface)", border: "1px solid var(--border)" }}>
                <thead>
                  <tr style={{ background: "var(--surface-sunken)", borderBottom: "2px solid var(--border)", textAlign: "left" }}>
                    <th style={{ padding: "12px 14px", fontWeight: 700, color: "var(--text-bright)" }}>Category</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700, color: "var(--text-bright)" }}>Capital Req.</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700, color: "var(--text-bright)" }}>Estimated Yield</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700, color: "var(--text-bright)" }}>Key Qualification Metric</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700, color: "var(--text-bright)" }}>Sybil Filter Strictness</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--accent)" }}>Testnet / Devnet</td>
                    <td style={{ padding: "12px 14px" }}>$0.00 (Free Faucets)</td>
                    <td style={{ padding: "12px 14px" }}>$250 – $2,500</td>
                    <td style={{ padding: "12px 14px" }}>RPC transactions, contract deploys, faucet claims</td>
                    <td style={{ padding: "12px 14px" }}><span style={{ color: "var(--emerald)", fontWeight: 700 }}>Moderate</span> (Discord/Gitcoin)</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(0,0,0,0.01)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--accent)" }}>Retroactive L2/L1</td>
                    <td style={{ padding: "12px 14px" }}>$15 – $80 (Gas)</td>
                    <td style={{ padding: "12px 14px" }}>$1,200 – $12,000</td>
                    <td style={{ padding: "12px 14px" }}>Bridge volume, 4+ active months, dApp diversity</td>
                    <td style={{ padding: "12px 14px" }}><span style={{ color: "var(--rose)", fontWeight: 700 }}>Extreme</span> (Clustering Heuristics)</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--accent)" }}>Liquid Restaking</td>
                    <td style={{ padding: "12px 14px" }}>$500+ (Staked Capital)</td>
                    <td style={{ padding: "12px 14px" }}>12% – 35% APY + Points</td>
                    <td style={{ padding: "12px 14px" }}>Time-weighted TVL deposit (e.g. EigenLayer, Solayer)</td>
                    <td style={{ padding: "12px 14px" }}><span style={{ color: "var(--emerald)", fontWeight: 700 }}>Low</span> (Capital Weighted)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "12px 14px", fontWeight: 700, color: "var(--accent)" }}>DePIN &amp; AI Compute</td>
                    <td style={{ padding: "12px 14px" }}>$0.00 (Bandwidth / Hardware)</td>
                    <td style={{ padding: "12px 14px" }}>$400 – $4,500</td>
                    <td style={{ padding: "12px 14px" }}>Node uptime, bandwidth sharing (Grass, io.net)</td>
                    <td style={{ padding: "12px 14px" }}><span style={{ color: "var(--amber)", fontWeight: 700 }}>High</span> (Hardware Fingerprints)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4 Golden Rules of Non-Custodial Airdrop Security */}
            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: 16, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
              The 4 Non-Negotiable Rules of Safe Airdrop Participation
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
              <div style={{ padding: 18, background: "var(--surface-sunken)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6, color: "var(--text-bright)" }}>🛡️ 1. Wallet Isolation</div>
                <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.6, color: "var(--text)" }}>
                  Never connect your primary cold-storage or net-worth vault to dApps. Deploy isolated burner wallets funded through exchange sub-accounts.
                </p>
              </div>
              <div style={{ padding: 18, background: "var(--surface-sunken)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6, color: "var(--text-bright)" }}>🔒 2. Zero Unlimited Approvals</div>
                <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.6, color: "var(--text)" }}>
                  Always revoke unlimited ERC-20 / SPL allowances using tools like Revoke.cash immediately following transaction confirmation.
                </p>
              </div>
              <div style={{ padding: 18, background: "var(--surface-sunken)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6, color: "var(--text-bright)" }}>📅 3. Temporal Consistency</div>
                <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.6, color: "var(--text)" }}>
                  Avoid single-day transaction spam. Protocol algorithms score natural user behavior across distinct calendar weeks and months.
                </p>
              </div>
              <div style={{ padding: 18, background: "var(--surface-sunken)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 6, color: "var(--text-bright)" }}>🚫 4. Never Reveal Seed Keys</div>
                <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.6, color: "var(--text)" }}>
                  No legitimate crypto airdrop team or claim portal will ever request your 12/24-word seed recovery phrase or private key.
                </p>
              </div>
            </div>

            {/* Quick Links to Silos */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", paddingTop: 8 }}>
              <Link href="/projects/" className="btn btn-primary btn-sm">
                Explore All 34+ Airdrop Projects →
              </Link>
              <Link href="/guides/" className="btn btn-outline btn-sm">
                Farming &amp; Anti-Sybil Playbooks →
              </Link>
              <Link href="/methodology/" className="btn btn-outline btn-sm">
                5-Stage Verification Standard →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Intelligence Section */}
      <section className="section" style={{ background: "var(--surface-sunken)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>
                🧠 ON-CHAIN INTEL
              </span>
              <h2 style={{ fontSize: "1.9rem", fontWeight: 800, marginTop: 8, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                Latest Analysis &amp; Research
              </h2>
            </div>
            <Link href="/blog/" className="btn btn-outline btn-sm" style={{ background: "var(--surface)" }}>
              All Articles →
            </Link>
          </div>
          <BlogGrid posts={otherPosts} />
        </div>
      </section>

      {/* Methodology & Sybil Defense Hub Section (EisnerAmper Style Institutional Cards) */}
      <section className="section">
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div>
              <span className="pill-badge" style={{ background: "rgba(217, 119, 6, 0.08)", color: "var(--amber)" }}>
                🔬 AUDIT &amp; METHODOLOGY
              </span>
              <h2 style={{ fontSize: "1.9rem", fontWeight: 800, marginTop: 8, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                Cryptographic Verification Standards
              </h2>
            </div>
            <Link href="/methodology/" className="btn btn-outline btn-sm">
              Full Methodology →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            <MotionCard style={{ padding: 0, overflow: "hidden", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
                <Image
                  src="/images/generated/5-stage-smart-contract-audit-telemetry-framework-featured-v2.jpg"
                  alt="5-Stage Contract Audit"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: 24 }}>
                <span className="pill-badge" style={{ fontSize: "0.7rem", marginBottom: 10, background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>🛡️ PROTOCOL AUDIT</span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "6px 0 10px", color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                  5-Stage Contract Audit
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.65, margin: "0 0 14px", opacity: 0.88 }}>
                  Bytecode decompilation, proxy admin timelocks, and reentrancy detection across EVM, SVM, and Move runtimes.
                </p>
                <Link href="/methodology/5-stage-smart-contract-audit-telemetry-framework/" style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
                  Read Audit Framework →
                </Link>
              </div>
            </MotionCard>

            <MotionCard style={{ padding: 0, overflow: "hidden", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
                <Image
                  src="/images/generated/solana-multi-wallet-isolation-sybil-defense-masterclass-2026-featured-v2.jpg"
                  alt="Sybil Clustering Defense"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: 24 }}>
                <span className="pill-badge" style={{ fontSize: "0.7rem", marginBottom: 10, background: "rgba(5, 150, 105, 0.08)", color: "var(--emerald)" }}>🧬 ON-CHAIN DEFENSE</span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "6px 0 10px", color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                  Sybil Clustering Defense
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.65, margin: "0 0 14px", opacity: 0.88 }}>
                  Heuristic modeling of temporal clustering, funding graph overlap, and CEX batch deposit signatures.
                </p>
                <Link href="/guides/solana-multi-wallet-isolation-sybil-defense-masterclass-2026/" style={{ fontSize: "0.85rem", color: "var(--emerald)", fontWeight: 700, textDecoration: "none" }}>
                  Explore Sybil Heuristics →
                </Link>
              </div>
            </MotionCard>

            <MotionCard style={{ padding: 0, overflow: "hidden", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
                <Image
                  src="/images/generated/editorial-integrity-charter-and-fact-checking-code-featured-v2.jpg"
                  alt="Strict Editorial Integrity"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: 24 }}>
                <span className="pill-badge" style={{ fontSize: "0.7rem", marginBottom: 10, background: "rgba(217, 119, 6, 0.08)", color: "var(--amber)" }}>⚖️ FACT-CHECKING</span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "6px 0 10px", color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                  Strict Editorial Integrity
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.65, margin: "0 0 14px", opacity: 0.88 }}>
                  100% unsponsored protocol evaluations with zero token allocations accepted from featured crypto teams.
                </p>
                <Link href="/editorial-policy/editorial-integrity-charter-and-fact-checking-code/" style={{ fontSize: "0.85rem", color: "var(--amber)", fontWeight: 700, textDecoration: "none" }}>
                  View Editorial Charter →
                </Link>
              </div>
            </MotionCard>
          </div>
        </div>
      </section>

      {/* AEO Master FAQ Section */}
      <section className="section">
        <div className="wrap" style={{ maxWidth: 940, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>
              🔍 Airdrop Telemetry &amp; Verification FAQ
            </span>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, marginTop: 8, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
              Frequently Asked Questions About Crypto Airdrops
            </h2>
            <p style={{ color: "var(--text)", maxWidth: 620, margin: "8px auto 0", opacity: 0.88 }}>
              Direct answers to common inquiries regarding non-custodial farming, sybil resistance, and contract auditing.
            </p>
          </div>
          <FaqAccordion faqs={homeFaqs} />
        </div>
      </section>

      {/* Trust & E-E-A-T Guarantee Banner */}
      <section className="section" style={{ background: "var(--surface-sunken)", borderTop: "1px solid var(--border)" }}>
        <div className="wrap">
          <MotionCard style={{ padding: 40, textAlign: "center", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
            <div style={{ display: "inline-flex", marginBottom: 12 }}>
              <span className="pill-badge" style={{ background: "rgba(5, 150, 105, 0.08)", color: "var(--emerald)", fontWeight: 700 }}>
                🛡️ CRYPTOGRAPHIC VERIFICATION
              </span>
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 12, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
              Built on Transparent Evaluation &amp; Zero Custody
            </h2>
            <p style={{ color: "var(--text)", maxWidth: 640, margin: "0 auto 24px", fontSize: "0.98rem", lineHeight: 1.65, opacity: 0.88 }}>
              We never take paid compensation for rankings or listings. Every guide undergoes multi-stage smart contract auditing and on-chain simulation.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
              <Link href="/about/" className="btn btn-outline btn-sm">About Us</Link>
              <Link href="/editorial-policy/" className="btn btn-outline btn-sm">Editorial Policy</Link>
              <Link href="/methodology/" className="btn btn-primary btn-sm">Evaluation Framework</Link>
            </div>
          </MotionCard>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
