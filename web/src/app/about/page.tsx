import type { Metadata } from "next";
import Link from "next/link";
import { AUTHORS } from "@/lib/data";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "About Us — Editorial Mission, Leadership & Standards",
  description:
    "Learn about Crypto Airdrop AI, our independent on-chain research methodology, our editorial fact-checking standards, and the analysts behind our crypto guides.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About Crypto Airdrop AI",
    "url": "https://cryptoairdropai.com/about",
    "description": "Crypto Airdrop AI is an independent, non-custodial crypto research portal, token distribution aggregator, and Web3 education platform.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Crypto Airdrop AI",
      "url": "https://cryptoairdropai.com",
      "logo": "https://cryptoairdropai.com/logo-primary.svg",
      "foundingDate": "2024",
      "sameAs": [
        "https://twitter.com/cryptoairdropai",
        "https://t.me/cryptoairdropai"
      ],
      "knowsAbout": [
        "Cryptocurrency",
        "Decentralized Finance (DeFi)",
        "Token Airdrops",
        "Blockchain Security",
        "Smart Contract Analysis",
        "Layer 2 Rollups"
      ]
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://cryptoairdropai.com/about" }
    ]
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 980, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / About Us
        </div>

        <MotionFade delay={0.05} direction="up" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge">⚡ Autonomous On-Chain Intelligence</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 16px" }}>
            About Crypto Airdrop AI
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--muted)", maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            Decentralized protocol research, algorithmic tokenomics indexing, and actionable security standards for modern Web3 participants.
          </p>
        </MotionFade>

        {/* 21st.dev Telemetry Bento Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16, marginBottom: 48 }}>
          <MotionCard style={{ gridColumn: "span 7", padding: 32 }}>
            <div style={{ color: "var(--accent)", fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Our Foundational Mission
            </div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "12px 0 16px" }}>
              Eliminating Misinformation in Token Distribution
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.98rem", lineHeight: 1.7, margin: 0 }}>
              Web3 is plagued with predatory phishing clones, speculative spam, and sybil traps. We build algorithmic crawlers and fact-checked walkthroughs to give users verifiable on-chain transparency.
            </p>
          </MotionCard>

          <MotionCard style={{ gridColumn: "span 5", padding: 32, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: "2.6rem", fontWeight: 900, color: "var(--accent2)" }}>50+ Chains</div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", marginTop: 4 }}>Continuous RPC Indexing</div>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: 8 }}>
              Real-time monitoring across EVM, SVM, Cosmos &amp; modular rollups.
            </p>
          </MotionCard>

          <MotionCard style={{ gridColumn: "span 4", padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--accent)" }}>0 Custody</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>Non-Custodial</div>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 4 }}>0 private keys or deposits stored</div>
          </MotionCard>

          <MotionCard style={{ gridColumn: "span 4", padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--accent2)" }}>100%</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>Fact-Checked</div>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 4 }}>Cryptographic testnet replication</div>
          </MotionCard>

          <MotionCard style={{ gridColumn: "span 4", padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--text)" }}>24/7</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>Snapshot Monitoring</div>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 4 }}>Block height &amp; epoch tracking</div>
          </MotionCard>
        </div>

        {/* Core Pillars */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 20 }}>Core Operational Pillars</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <MotionCard style={{ padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🛡️</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>On-Chain Verification</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                Every qualifying route is executed directly by our test nodes on public testnets or mainnets before being documented.
              </p>
            </MotionCard>

            <MotionCard style={{ padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>🔍</div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>Sybil-Safe Heuristics</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                We guide participants on wallet hygiene, transaction randomization, and multi-contract interaction to avoid industrial sybil clusters.
              </p>
            </MotionCard>
          </div>
        </div>

        {/* AI Intelligence Nodes Preview */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>AI Intelligence &amp; Research Desk</h2>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", margin: "4px 0 0" }}>Verified entities authoring on-chain intelligence</p>
            </div>
            <Link href="/authors" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              View Directory →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {AUTHORS.map((author) => (
              <MotionCard key={author.slug} style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 50, height: 50, borderRadius: 25, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                    {author.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
                      <Link href={`/authors/${author.slug}`}>{author.name}</Link>
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--accent)" }}>{author.role}</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6, marginBottom: 14 }}>
                  {author.bio.substring(0, 115)}...
                </p>
                <Link href={`/authors/${author.slug}`} style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent2)" }}>
                  Inspect Bio &amp; Authored Guides →
                </Link>
              </MotionCard>
            ))}
          </div>
        </div>

        {/* Interlinked Authority Hub */}
        <MotionCard style={{ padding: 32, background: "linear-gradient(135deg, rgba(124,92,255,0.1), rgba(0,224,164,0.05))" }}>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>Institutional Trust &amp; Standards</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 20 }}>
            Crypto Airdrop AI operates under strict fact-checking ethics, transparent evaluation scoring, and explicit non-financial advice mandates.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link href="/editorial-policy" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              📖 Editorial Policy
            </Link>
            <Link href="/methodology" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              🔬 Evaluation Methodology
            </Link>
            <Link href="/disclaimer" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              ⚖️ Financial Disclaimer
            </Link>
            <Link href="/contact" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              ✉️ Contact Editorial
            </Link>
          </div>
        </MotionCard>
      </div>
    </section>
  );
}
