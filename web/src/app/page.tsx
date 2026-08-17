import Link from "next/link";
import BlogGrid from "@/components/BlogGrid";
import Newsletter from "@/components/Newsletter";
import { GUIDES } from "@/lib/data";
import { getAllPosts } from "@/lib/cms/blogService";

export default async function Home() {
  const allPosts = await getAllPosts();
  const featuredPost = allPosts[0];
  const otherPosts = allPosts.slice(1);

  return (
    <>
      <div className="announce">
        🚀 The complete guide to crypto security in 2026 is out —{" "}
        <Link href={`/blog/how-to-farm-airdrops-safely-2026`}>read it here</Link>
      </div>

      <section className="hero" style={{ padding: "60px 0 40px" }}>
        <div className="wrap hero-grid">
          <div>
            <span className="badge hot" style={{ marginBottom: 16, display: "inline-block" }}>Featured Story</span>
            <h1 style={{ fontSize: "3rem", lineHeight: 1.1, marginBottom: 24, fontWeight: 900, letterSpacing: "-0.03em" }}>
              {featuredPost.title}
            </h1>
            <p style={{ fontSize: "1.25rem", color: "var(--muted)", marginBottom: 32, lineHeight: 1.6 }}>
              {featuredPost.excerpt}
            </p>
            <div className="hero-actions">
              <Link href={`/blog/${featuredPost.slug}`} className="btn btn-primary">
                Read Article
              </Link>
              <Link href="/blog" className="btn btn-outline">
                All News
              </Link>
            </div>
            <div className="hero-stats" style={{ marginTop: 40, borderTop: "1px solid var(--border)", paddingTop: 32 }}>
              <div className="hero-stat">
                <b>320K+</b>
                <span>Monthly Readers</span>
              </div>
              <div className="hero-stat">
                <b>Daily</b>
                <span>Alpha Published</span>
              </div>
            </div>
          </div>
          
          <div className="hero-card" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "32px 24px" }}>
            <h3 style={{ fontSize: "1.25rem", borderBottom: "1px solid var(--border)", paddingBottom: 16, marginBottom: 24 }}>Top Guides & Tutorials</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 24 }}>
              {GUIDES.slice(0,4).map(g => (
                <li key={g.slug}>
                  <Link href={`/guides/${g.slug}`} style={{ color: "var(--fg)", fontWeight: 700, fontSize: "1.1rem", textDecoration: "none", display: "block", marginBottom: 6, lineHeight: 1.3 }}>
                    {g.title}
                  </Link>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.85rem", color: "var(--muted)" }}>
                    <span className="badge confirmed" style={{ padding: "2px 6px", fontSize: "10px" }}>{g.level}</span>
                    <span>5 min read</span>
                  </div>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 32 }}>
              <Link href="/guides" className="btn btn-primary" style={{ width: "100%", display: "block", textAlign: "center" }}>
                View All Guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="latest-news">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Latest News & Analysis</h2>
              <p>The bleeding edge of crypto, delivered daily.</p>
            </div>
            <Link href="/blog">View all articles →</Link>
          </div>
          <BlogGrid posts={otherPosts} />
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="section-head" style={{ textAlign: "center", marginBottom: 40 }}>
            <div>
              <h2>Why Trust Crypto Airdrop AI?</h2>
              <p>Institutional-grade on-chain intelligence and strict fact-checking standards.</p>
            </div>
          </div>
          <div style={{ display: "grid", gap: 32, gridTemplateColumns: "1fr 1fr", marginTop: 24 }}>
            <div>
              <h3 style={{ marginBottom: 12 }}>🛡️ Unbiased Research</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>We do not accept paid listings for our core editorial content. Every airdrop guide and protocol review is researched independently.</p>
            </div>
            <div>
              <h3 style={{ marginBottom: 12 }}>⚡ Actionable Steps</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>We turn complex on-chain mechanics into simple, step-by-step guides so you can interact with DeFi protocols safely.</p>
            </div>
            <div>
              <h3 style={{ marginBottom: 12 }}>🔒 Safety &amp; Non-Custodial</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>Security is paramount. We teach wallet hygiene, sybil-avoidance heuristics, and how to verify smart contracts before signing transactions.</p>
            </div>
            <div>
              <h3 style={{ marginBottom: 12 }}>📅 Real-Time Snapshot Tracking</h3>
              <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>The market moves fast. Our research team updates guides continuously to ensure you have the latest snapshot and block height information.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
