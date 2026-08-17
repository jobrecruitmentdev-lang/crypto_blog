import type { Metadata } from "next";
import Link from "next/link";
import { AUTHORS } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us — Editorial Mission, Leadership & Standards",
  description:
    "Learn about Crypto Airdrop AI, our independent on-chain research methodology, our editorial fact-checking standards, and the analysts behind our crypto guides.",
  alternates: { canonical: "/about" },
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
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 20 }}>
          <Link href="/">Home</Link> / About Us
        </div>

        <div className="section-head" style={{ marginBottom: 32 }}>
          <div>
            <span style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Our Identity &amp; Purpose
            </span>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginTop: 8, letterSpacing: "-0.02em" }}>
              About Crypto Airdrop AI
            </h1>
            <p style={{ fontSize: "1.15rem", color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>
              Independent research, verified on-chain analytics, and actionable security standards for the decentralized Web3 economy.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: 28, marginBottom: 36, borderLeft: "4px solid var(--primary)", background: "var(--surface)" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>Our Mission</h3>
          <p style={{ color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
            Crypto Airdrop AI was created to solve a pervasive problem in Web3: speculative misinformation, predatory phishing clones, and opaque reward mechanics. Our objective is to empower everyday crypto users with institutional-grade on-chain intelligence, verified protocol guides, and objective risk ratings — completely free and independent.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 40 }}>
          <div className="card" style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--primary)" }}>500+</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>Protocols Analyzed</div>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 4 }}>EVM, SVM &amp; Appchain ecosystems</div>
          </div>
          <div className="card" style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--primary)" }}>100%</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>Fact-Checked</div>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 4 }}>Multi-step cryptographic verification</div>
          </div>
          <div className="card" style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--primary)" }}>0 Custody</div>
            <div style={{ fontWeight: 700, marginTop: 4 }}>Non-Custodial</div>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 4 }}>We never request keys or hold funds</div>
          </div>
        </div>

        <div style={{ marginBottom: 40, lineHeight: 1.8 }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 16 }}>What We Do</h2>
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>
            Every week, our research desk monitors thousands of on-chain contract deployments, governance proposals, testnet releases, and points programs across Ethereum, Solana, Arbitrum, Optimism, Base, Monad, and 40+ other networks.
          </p>
          <ul style={{ paddingLeft: 20, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 8 }}>
            <li><strong>Manual On-Chain Verification:</strong> We test and verify qualifying steps directly on testnets and mainnets before documenting them.</li>
            <li><strong>Sybil Resistance &amp; Wallet Hygiene:</strong> We author actionable guides on wallet segregation, contract revoking, and heuristic safety.</li>
            <li><strong>Transparent Risk Disclosures:</strong> We clearly label every opportunity as Confirmed, Ongoing, or Potential, detailing gas costs and contract risks.</li>
          </ul>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0 }}>Meet Our Research Team</h2>
            <Link href="/authors" style={{ color: "var(--primary)", fontWeight: 700, fontSize: "0.95rem" }}>
              View All Authors →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {AUTHORS.map((author) => (
              <div key={author.slug} className="card" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 22, background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {author.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
                      <Link href={`/authors/${author.slug}`}>{author.name}</Link>
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>{author.role}</span>
                  </div>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5, marginBottom: 12 }}>
                  {author.bio.substring(0, 110)}...
                </p>
                <Link href={`/authors/${author.slug}`} style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>
                  Read Bio &amp; Articles →
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24, background: "var(--surface)" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 12 }}>Institutional Standards &amp; Policies</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 16 }}>
            Crypto Airdrop AI operates under strict editorial independence, non-financial advice mandates, and transparent disclosure frameworks.
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
        </div>
      </div>
    </section>
  );
}
