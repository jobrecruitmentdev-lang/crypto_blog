import Link from "next/link";
import BlogGrid from "@/components/BlogGrid";
import Newsletter from "@/components/Newsletter";
import FilterableGrid from "@/components/FilterableGrid";
import { GUIDES } from "@/lib/data";
import { getAllPosts } from "@/lib/cms/blogService";
import { getProjects, getArticles } from "@/lib/contentStore";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export default async function Home() {
  const [allPosts, allProjects, guideArticles, methodologyArticles] = await Promise.all([
    getAllPosts(),
    getProjects(),
    getArticles("guides"),
    getArticles("methodology"),
  ]);

  const featuredPost = allPosts[0];
  const otherPosts = allPosts.slice(0, 6);
  const activeGuides = guideArticles.length > 0 ? guideArticles : GUIDES;

  return (
    <>
      {/* CoinDesk Style Live Market Ticker Strip */}
      <div className="tui-top-bar" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", color: "var(--muted)", fontSize: "0.82rem" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <span><span style={{ color: "var(--emerald)", fontWeight: 800 }}>●</span> RPC INGESTION: <b style={{ color: "var(--text-bright)" }}>OPTIMAL (14ms)</b></span>
          <span>BTC: <b style={{ color: "var(--text-bright)" }}>$88,450</b> <span style={{ color: "var(--emerald)", fontSize: "0.75rem", fontWeight: 700 }}>+2.4%</span></span>
          <span>ETH: <b style={{ color: "var(--text-bright)" }}>$3,210</b> <span style={{ color: "var(--emerald)", fontSize: "0.75rem", fontWeight: 700 }}>+1.8%</span></span>
          <span>SOL: <b style={{ color: "var(--text-bright)" }}>$185</b> <span style={{ color: "var(--emerald)", fontSize: "0.75rem", fontWeight: 700 }}>+4.2%</span></span>
          <span>ACTIVE CHAINS: <b style={{ color: "var(--text-bright)" }}>50+ INDEXED</b></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: 600, color: "var(--accent)" }}>ALPHA DISPATCH: </span>
          <Link href="/blog/how-to-farm-airdrops-safely-2026/" style={{ color: "var(--text-bright)", fontWeight: 600, textDecoration: "none" }}>
            2026 Security Playbook →
          </Link>
        </div>
      </div>

      {/* CoinDesk Media Bento Hero Section */}
      <section className="section" style={{ padding: "36px 0 28px" }}>
        <div className="wrap">
          <div className="hero-bento">
            
            {/* Left Primary Lead Story (65% Width) */}
            <MotionCard 
              style={{ 
                padding: 36, 
                display: "flex", 
                flexDirection: "column", 
                justifyContent: "space-between", 
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)", fontWeight: 700, fontSize: "0.75rem" }}>
                    ⚡ FEATURED INTEL REPORT
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 600 }}>
                    ID: INTEL-2026-08
                  </span>
                </div>
                
                <h1 style={{ fontSize: "2.4rem", lineHeight: 1.2, fontWeight: 800, letterSpacing: "-0.025em", marginBottom: 16, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                  {featuredPost ? featuredPost.title : "The 2026 Decentralized Airdrop Almanac"}
                </h1>
                
                <p style={{ fontSize: "1.05rem", color: "var(--text)", lineHeight: 1.65, marginBottom: 26, opacity: 0.9 }}>
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
              <div className="stats-bento" style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid var(--border-subtle)" }}>
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
                padding: 28, 
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

              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, justifyContent: "space-around" }}>
                {activeGuides.slice(0, 4).map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}/`}
                    style={{
                      display: "block",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--surface-sunken)",
                      border: "1px solid var(--border-subtle)",
                      textDecoration: "none",
                      transition: "all 0.2s ease",
                    }}
                    className="hover:border-blue-400"
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span className="pill-badge" style={{ fontSize: "0.68rem", padding: "2px 6px", background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)" }}>
                        {'level' in g ? g.level : (g.tag || 'Tactical')}
                      </span>
                      <span style={{ fontSize: "0.74rem", color: "var(--muted)", fontWeight: 500 }}>
                        {'read' in g ? g.read : "6 MIN READ"}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text-bright)", lineHeight: 1.35 }}>
                      {g.title}
                    </div>
                  </Link>
                ))}
              </div>
            </MotionCard>

          </div>
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
            <MotionCard style={{ padding: 28, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 14 }}>🛡️</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 10, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                5-Stage Contract Audit
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.65, opacity: 0.88 }}>
                Bytecode decompilation, proxy admin timelocks, and reentrancy detection across EVM, SVM, and Move runtimes.
              </p>
              <Link href="/methodology/5-stage-smart-contract-audit-telemetry-framework/" style={{ display: "inline-block", marginTop: 14, fontSize: "0.85rem", color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
                Read Audit Framework →
              </Link>
            </MotionCard>

            <MotionCard style={{ padding: 28, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 14 }}>🧬</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 10, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                Sybil Clustering Defense
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.65, opacity: 0.88 }}>
                Heuristic modeling of temporal clustering, funding graph overlap, and CEX batch deposit signatures.
              </p>
              <Link href="/methodology/" style={{ display: "inline-block", marginTop: 14, fontSize: "0.85rem", color: "var(--emerald)", fontWeight: 700, textDecoration: "none" }}>
                Explore Sybil Heuristics →
              </Link>
            </MotionCard>

            <MotionCard style={{ padding: 28, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 14 }}>⚖️</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 10, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>
                Strict Editorial Integrity
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text)", lineHeight: 1.65, opacity: 0.88 }}>
                100% unsponsored protocol evaluations with zero token allocations accepted from featured crypto teams.
              </p>
              <Link href="/editorial-policy/editorial-integrity-charter-and-fact-checking-code/" style={{ display: "inline-block", marginTop: 14, fontSize: "0.85rem", color: "var(--amber)", fontWeight: 700, textDecoration: "none" }}>
                View Editorial Charter →
              </Link>
            </MotionCard>
          </div>
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
