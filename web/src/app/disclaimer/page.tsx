import type { Metadata } from "next";
import Link from "next/link";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Financial & Affiliate Disclaimer — Not Financial Advice",
  description:
    "Official risk disclosures, non-financial advice notices (NFA/DYOR), smart contract risk warnings, and FTC affiliate disclosures for Crypto Airdrop AI.",
  alternates: { canonical: "/disclaimer/" },
};

export default function DisclaimerPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Disclaimer", "item": "https://cryptoairdropai.com/disclaimer" }
    ]
  };

  const riskCards = [
    {
      title: "Smart Contract Vulnerabilities",
      icon: "⚡",
      desc: "Interacting with decentralized applications involves smart contracts that may contain bugs, unverified proxy logic, or flash-loan exploit vectors.",
      level: "High Risk",
    },
    {
      title: "Phishing & Fake Clones",
      icon: "🎣",
      desc: "Malicious actors frequently clone genuine airdrop claim portals. Always verify URLs, DNS certificates, and token contract addresses.",
      level: "Critical Caution",
    },
    {
      title: "Gas Fee Irreversibility",
      icon: "⛽",
      desc: "Transactions on blockchain networks are final. Network congestion can cause volatile gas costs with no guarantee of retroactive token allocation.",
      level: "Financial Exposure",
    },
  ];

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 940, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Disclaimer
        </div>

        <MotionFade delay={0.05} direction="up" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge" style={{ borderColor: "rgba(255, 181, 71, 0.4)", color: "var(--warn)", background: "rgba(255, 181, 71, 0.1)" }}>
              ⚠️ Mandatory Risk Disclosures
            </span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 16px" }}>
            Financial &amp; Affiliate Disclaimer
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--muted)", maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            Educational research notice, non-financial advice terms (NFA/DYOR), and FTC commercial transparency.
          </p>
        </MotionFade>

        {/* Highlight Callout */}
        <MotionCard style={{ padding: 32, marginBottom: 40, borderLeft: "4px solid var(--warn)" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--warn)", marginBottom: 8 }}>
            Not Financial or Investment Advice (NFA)
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.98rem", lineHeight: 1.7, margin: 0 }}>
            Nothing published on Crypto Airdrop AI (cryptoairdropai.com) constitutes financial, legal, or investment advice. All materials, guides, and ratings are curated strictly for educational and open-source research purposes. We strongly advise users to perform their own due diligence (DYOR) and never risk capital they cannot afford to lose.
          </p>
        </MotionCard>

        {/* Risk Heatmap Grid */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 20 }}>
            Web3 On-Chain Risk Vector Matrix
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {riskCards.map((item, idx) => (
              <MotionCard key={idx} style={{ padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <span className="pill-badge" style={{ fontSize: "0.72rem", color: "var(--warn)", borderColor: "rgba(255,181,71,0.3)" }}>
                    {item.level}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </MotionCard>
            ))}
          </div>
        </div>

        {/* Regulatory & Affiliate Compliance */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
          <MotionCard style={{ padding: 28 }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 12 }}>⚖️ Zero Endorsement Guarantee</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>
              Listing a protocol does not imply endorsement or guaranteed value. Distribution criteria, token allocations, and snapshots are controlled entirely by third-party teams with zero platform influence.
            </p>
          </MotionCard>

          <MotionCard style={{ padding: 28 }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 12 }}>🔗 FTC Affiliate Transparency</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>
              Some external links to hardware wallets, testnet faucets, or analytics portals may generate affiliate referral commissions at no cost to you. This never influences our risk ratings.
            </p>
          </MotionCard>
        </div>

        {/* Interlinked Footer */}
        <MotionCard style={{ padding: 28, textAlign: "center" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>Review Our Security &amp; Legal Policies</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 20 }}>
            Read how we safeguard your data and audit protocols before publishing.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
            <Link href="/privacy" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              🔒 Privacy Policy
            </Link>
            <Link href="/terms" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              📜 Terms of Service
            </Link>
            <Link href="/methodology" className="btn btn-primary" style={{ fontSize: "0.85rem" }}>
              🔬 Evaluation Methodology
            </Link>
          </div>
        </MotionCard>
      </div>
    </section>
  );
}
