import type { Metadata } from "next";
import Link from "next/link";
import GuideGrid from "@/components/GuideGrid";
import { GUIDES } from "@/lib/data";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Airdrop & Layer-2 Farming Guides — Step-by-Step Tutorials",
  description: "Step-by-step guides covering non-custodial wallet setup, bridging, snapshot mechanics, and sybil-safe farming strategies.",
  alternates: { canonical: "/guides/" },
};

export default function GuidesPage() {
  const guideCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Crypto Airdrop AI Step-by-Step Guides",
    "url": "https://cryptoairdropai.com/guides",
    "description": "Educational guides for on-chain crypto security, testnet farming, and snapshot eligibility.",
    "hasPart": GUIDES.map((g) => ({
      "@type": "HowTo",
      "name": g.title,
      "description": g.desc,
      "url": `https://cryptoairdropai.com/guides/${g.slug}`
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://cryptoairdropai.com/guides" }
    ]
  };

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideCollectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap">
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Guides &amp; Tutorials
        </div>

        <MotionFade delay={0.05} direction="up" style={{ marginBottom: 40 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge success">📖 Practical On-Chain Playbooks</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 16px" }}>
            Airdrop &amp; DeFi Strategy Guides
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--muted)", maxWidth: 720, lineHeight: 1.6 }}>
            Everything you need to interact with smart contracts safely, optimize gas fees, and avoid sybil clustering.
          </p>
        </MotionFade>

        {/* Guides Grid */}
        <GuideGrid guides={GUIDES} />

        {/* Security Alert Callout */}
        <MotionCard style={{ marginTop: 64, padding: 32, borderLeft: "4px solid var(--accent2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span className="pill-badge success" style={{ fontSize: "0.72rem" }}>🔒 Security First Rule</span>
          </div>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "0.95rem", lineHeight: 1.6 }}>
            Never enter your seed phrase on any website. Use dedicated burning wallets for unverified testnets and revoke token allowances with <a href="https://revoke.cash" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>Revoke.cash</a> after interacting.
          </p>
        </MotionCard>
      </div>
    </section>
  );
}
