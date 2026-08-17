import Link from "next/link";
import BlogGrid from "@/components/BlogGrid";
import Newsletter from "@/components/Newsletter";
import FilterableGrid from "@/components/FilterableGrid";
import { GUIDES, AIRDROPS } from "@/lib/data";
import { getAllPosts } from "@/lib/cms/blogService";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export default async function Home() {
  const allPosts = await getAllPosts();
  const featuredPost = allPosts[0];
  const otherPosts = allPosts;

  return (
    <>
      {/* TUI Telemetry Header Strip */}
      <div className="tui-top-bar">
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span><span style={{ color: "var(--emerald)" }}>●</span> RPC INGESTION: <b>ONLINE</b></span>
          <span>LATENCY: <b>14ms</b></span>
          <span>CHAINS: <b>50+ INDEXED</b></span>
        </div>
        <div>
          <span>LATEST INTEL: </span>
          <Link href="/blog/how-to-farm-airdrops-safely-2026">2026 Security Playbook →</Link>
        </div>
      </div>

      {/* TUI Command Center Hero Section */}
      <section className="section" style={{ padding: "40px 0 28px" }}>
        <div className="wrap">
          <div className="hero-bento">
            
            {/* Left Terminal Matrix Hero */}
            <MotionCard style={{ padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between", borderColor: "rgba(0, 240, 255, 0.25)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span className="pill-badge gold">⚡ [ FEATURED INTEL REPORT ]</span>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "monospace" }}>ID: INTEL-2026-08</span>
                </div>
                
                <h1 style={{ fontSize: "2.3rem", lineHeight: 1.18, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 14, color: "var(--text-bright)" }}>
                  {featuredPost ? featuredPost.title : "The 2026 Decentralized Airdrop Almanac"}
                </h1>
                
                <p style={{ fontSize: "1.05rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: 24 }}>
                  {featuredPost ? featuredPost.excerpt : "Automated RPC tracking, Sybil cluster defense, and on-chain snapshot verifications across 50+ Web3 networks."}
                </p>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  <Link href={featuredPost ? `/blog/${featuredPost.slug}` : "/blog"} className="btn btn-primary">
                    Read Report →
                  </Link>
                  <Link href="/blog" className="btn btn-outline">
                    Browse Intelligence Feed
                  </Link>
                </div>
              </div>

              {/* TUI Telemetry Status Bar */}
              <div className="stats-bento" style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--border-subtle)" }}>
                <div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--cyan)", fontFamily: "monospace" }}>50+</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 800 }}>Chains Tracked</div>
                </div>
                <div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--emerald)", fontFamily: "monospace" }}>0-KEYS</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 800 }}>Non-Custodial</div>
                </div>
                <div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--amber)", fontFamily: "monospace" }}>$0 PAID</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 800 }}>Zero Sponsored</div>
                </div>
              </div>
            </MotionCard>

            {/* Right Guide Panel */}
            <MotionCard style={{ padding: 28, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border-subtle)" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "var(--cyan)", fontFamily: "monospace" }}>
                  [ ESSENTIAL PLAYBOOKS ]
                </h2>
                <Link href="/guides" style={{ fontSize: "0.8rem", color: "var(--muted)", textDecoration: "underline" }}>
                  ALL ({GUIDES.length})
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1, justifyContent: "space-around" }}>
                {GUIDES.slice(0, 4).map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    style={{
                      display: "block",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(0, 240, 255, 0.02)",
                      border: "1px solid var(--border-subtle)",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span className="pill-badge success" style={{ fontSize: "0.68rem", padding: "2px 6px" }}>{g.level}</span>
                      <span style={{ fontSize: "0.74rem", color: "var(--muted)", fontFamily: "monospace" }}>5 MIN READ</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text)" }}>{g.title}</div>
                  </Link>
                ))}
              </div>
            </MotionCard>

          </div>
        </div>
      </section>

      {/* TUI Radar Directory Section */}
      <section className="section">
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
            <div>
              <span className="pill-badge" style={{ marginBottom: 6 }}>📡 [ PROTOCOL SCANNER ]</span>
              <h2 style={{ fontSize: "1.85rem", fontWeight: 900, letterSpacing: "-0.02em", color: "var(--text-bright)" }}>
                Active &amp; Potential Distributions
              </h2>
            </div>
            <Link href="/methodology" style={{ fontSize: "0.82rem", color: "var(--cyan)", fontFamily: "monospace" }}>
              [ AUDIT METHODOLOGY → ]
            </Link>
          </div>
          <FilterableGrid airdrops={AIRDROPS} />
        </div>
      </section>

      {/* Recent Intelligence Section */}
      <section className="section" style={{ background: "rgba(8, 13, 26, 0.5)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <span className="pill-badge purple">🧠 [ ON-CHAIN INTEL ]</span>
              <h2 style={{ fontSize: "1.85rem", fontWeight: 900, marginTop: 6, color: "var(--text-bright)" }}>
                Latest Analysis &amp; Research
              </h2>
            </div>
            <Link href="/blog" className="btn btn-outline btn-sm">
              All Articles →
            </Link>
          </div>
          <BlogGrid posts={otherPosts} />
        </div>
      </section>

      {/* Trust & E-E-A-T Guarantee Banner */}
      <section className="section">
        <div className="wrap">
          <MotionCard style={{ padding: 36, textAlign: "center", background: "linear-gradient(180deg, rgba(10, 17, 34, 0.9), rgba(4, 7, 13, 0.98))" }}>
            <div style={{ display: "inline-flex", marginBottom: 10 }}>
              <span className="pill-badge success">🛡️ [ CRYPTOGRAPHIC VERIFICATION ]</span>
            </div>
            <h2 style={{ fontSize: "1.7rem", fontWeight: 900, marginBottom: 10 }}>
              Built on Transparent Evaluation &amp; Zero Custody
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 620, margin: "0 auto 20px", fontSize: "0.98rem", lineHeight: 1.6 }}>
              We never take paid compensation for rankings or listings. Every guide undergoes 4-stage smart contract auditing and on-chain simulation.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 10 }}>
              <Link href="/about" className="btn btn-outline btn-sm">About Us</Link>
              <Link href="/editorial-policy" className="btn btn-outline btn-sm">Editorial Policy</Link>
              <Link href="/methodology" className="btn btn-primary btn-sm">Evaluation Framework</Link>
            </div>
          </MotionCard>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
