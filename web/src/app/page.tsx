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
  const otherPosts = allPosts.slice(1, 4);

  return (
    <>
      <div className="announce">
        ⚡ <b>2026 Alpha Ingestion Active:</b> 50+ chains monitored 24/7 with zero-custody AI crawlers —{" "}
        <Link href={`/blog/how-to-farm-airdrops-safely-2026`}>Read Security Briefing →</Link>
      </div>

      {/* Hero Section with Bento Grid */}
      <section className="section" style={{ padding: "48px 0 32px" }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24, alignItems: "stretch" }}>
            
            {/* Left Hero Card */}
            <MotionCard style={{ padding: 40, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "inline-flex", marginBottom: 16 }}>
                  <span className="pill-badge gold">🔥 Featured Intelligence Story</span>
                </div>
                <h1 style={{ fontSize: "2.5rem", lineHeight: 1.15, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 16 }}>
                  {featuredPost ? featuredPost.title : "The 2026 Crypto Airdrop Almanac"}
                </h1>
                <p style={{ fontSize: "1.1rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: 28 }}>
                  {featuredPost ? featuredPost.excerpt : "Actionable guides, retroactive distribution mechanics, and on-chain sybil safety."}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <Link href={featuredPost ? `/blog/${featuredPost.slug}` : "/blog"} className="btn btn-primary">
                    Read Investigation →
                  </Link>
                  <Link href="/blog" className="btn btn-outline">
                    Explore Intelligence Desk
                  </Link>
                </div>
              </div>

              {/* Stats Bar */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--accent)" }}>50+</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Chains Indexed</div>
                </div>
                <div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--accent2)" }}>100%</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Non-Custodial</div>
                </div>
                <div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--accent-gold)" }}>0%</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>Paid Promotions</div>
                </div>
              </div>
            </MotionCard>

            {/* Right Guide Bento */}
            <MotionCard style={{ padding: 32, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>📚 Essential Farming Guides</h2>
                <Link href="/guides" style={{ fontSize: "0.85rem", color: "var(--accent)", fontWeight: 700 }}>
                  View All ({GUIDES.length}) →
                </Link>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, justifyContent: "space-around" }}>
                {GUIDES.slice(0, 4).map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    style={{
                      display: "block",
                      padding: "12px 16px",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid var(--border)",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span className="pill-badge" style={{ fontSize: "0.7rem", padding: "2px 8px" }}>{g.level}</span>
                      <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>5 min read</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.98rem", color: "var(--text)" }}>{g.title}</div>
                  </Link>
                ))}
              </div>
            </MotionCard>

          </div>
        </div>
      </section>

      {/* Directory Section */}
      <section className="section">
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
            <div>
              <span className="pill-badge success" style={{ marginBottom: 8 }}>📡 Real-Time Radar</span>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
                Vetted Airdrop Opportunities
              </h2>
            </div>
            <Link href="/methodology" style={{ fontSize: "0.85rem", color: "var(--muted)", textDecoration: "underline" }}>
              How we rate these protocols
            </Link>
          </div>
          <FilterableGrid airdrops={AIRDROPS} />
        </div>
      </section>

      {/* Recent Intelligence Section */}
      <section className="section" style={{ background: "rgba(13, 18, 28, 0.4)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="wrap">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div>
              <span className="pill-badge">🧠 Market Intelligence</span>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, marginTop: 8 }}>
                Latest Analysis &amp; Reports
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
          <MotionCard style={{ padding: 40, textAlign: "center", background: "linear-gradient(180deg, rgba(18, 24, 38, 0.8), rgba(7, 9, 14, 0.95))" }}>
            <div style={{ display: "inline-flex", marginBottom: 12 }}>
              <span className="pill-badge success">🛡️ Zero-Compromise Fact Checking</span>
            </div>
            <h2 style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: 12 }}>
              Built on Cryptographic Verification &amp; Transparent Standards
            </h2>
            <p style={{ color: "var(--muted)", maxWidth: 640, margin: "0 auto 24px", fontSize: "1.05rem", lineHeight: 1.6 }}>
              We never take payment for listings or token promotions. Learn how our AI models and human researchers evaluate smart contracts.
            </p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
              <Link href="/about" className="btn btn-outline">About Us</Link>
              <Link href="/editorial-policy" className="btn btn-outline">Editorial Policy</Link>
              <Link href="/methodology" className="btn btn-primary">Evaluation Framework</Link>
            </div>
          </MotionCard>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
