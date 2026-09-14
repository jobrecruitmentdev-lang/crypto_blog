import type { Metadata } from "next";
import Link from "next/link";
import { AUTHORS, getPostsByAuthor } from "@/lib/data";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "AI Intelligence & Research Team — Verified Authors & Analysts",
  description:
    "Meet the AI nodes, smart contract analysts, and Web3 security contributors behind Crypto Airdrop AI.",
  alternates: { canonical: "/authors/" },
};

export default function AuthorsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Authors", "item": "https://cryptoairdropai.com/authors" }
    ]
  };

  const authorsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": AUTHORS.map((author, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Person",
        "name": author.name,
        "jobTitle": author.role,
        "url": `https://cryptoairdropai.com/authors/${author.slug}`,
        "description": author.bio
      }
    }))
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorsSchema) }} />

      <div className="wrap" style={{ maxWidth: 940, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Authors &amp; Analysts
        </div>

        <MotionFade delay={0.05} direction="up" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge" style={{ background: "rgba(37, 99, 235, 0.08)", color: "var(--accent)", fontWeight: 700 }}>
              🤖 Verified Research Personas
            </span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-0.025em", margin: "8px 0 16px", fontFamily: "var(--font-serif)", color: "var(--text-bright)" }}>
            AI Intelligence &amp; Research Desk
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--text)", maxWidth: 680, margin: "0 auto", lineHeight: 1.65, opacity: 0.88 }}>
            Autonomous blockchain telemetry crawlers, smart contract security sentinels, and research editors.
          </p>
        </MotionFade>

        {/* Authors Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: 24, marginBottom: 48 }}>
          {AUTHORS.map((author) => {
            const posts = getPostsByAuthor(author.slug);
            return (
              <MotionCard key={author.slug} style={{ padding: 28, background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 28, background: "var(--surface-sunken)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
                    {author.avatar}
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, fontFamily: "var(--font-serif)" }}>
                      <Link href={`/authors/${author.slug}/`} style={{ color: "var(--text-bright)", textDecoration: "none" }}>{author.name}</Link>
                    </h2>
                    <span style={{ fontSize: "0.82rem", color: "var(--accent)", fontWeight: 600 }}>{author.role}</span>
                  </div>
                </div>

                <p style={{ fontSize: "0.92rem", color: "var(--text)", lineHeight: 1.6, marginBottom: 20, opacity: 0.88 }}>
                  {author.bio}
                </p>

                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--muted)", fontWeight: 600 }}>
                    {posts.length} {posts.length === 1 ? "Authored Guide" : "Authored Guides"}
                  </span>
                  <Link href={`/authors/${author.slug}/`} className="btn btn-sm btn-outline" style={{ background: "var(--surface)" }}>
                    View Profile →
                  </Link>
                </div>
              </MotionCard>
            );
          })}
        </div>

        {/* Peer Review Callout */}
        <MotionCard style={{ padding: 32, textAlign: "center", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8, color: "var(--text-bright)", fontFamily: "var(--font-serif)" }}>Interested in Our Editorial Standards?</h3>
          <p style={{ color: "var(--text)", fontSize: "0.95rem", marginBottom: 20, opacity: 0.88 }}>
            Read how our AI nodes and human editors cross-check on-chain data before publishing.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Link href="/editorial-policy/" className="btn btn-primary" style={{ fontSize: "0.85rem" }}>
              📖 Read Editorial Policy
            </Link>
            <Link href="/methodology/" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              🔬 Evaluation Framework
            </Link>
          </div>
        </MotionCard>
      </div>
    </section>
  );
}
