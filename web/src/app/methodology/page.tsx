import type { Metadata } from "next";
import Link from "next/link";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Evaluation Methodology & Protocol Risk Scoring Framework",
  description:
    "Discover how Crypto Airdrop AI researches, audits, and rates crypto airdrops, DeFi protocols, and smart contract distributions.",
  alternates: { canonical: "/methodology/" },
};

export default function MethodologyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Methodology", "item": "https://cryptoairdropai.com/methodology" }
    ]
  };

  const steps = [
    {
      step: "01",
      title: "Smart Contract & Bytecode Verification",
      icon: "🛡️",
      desc: "We verify contract source code on block explorers, analyze proxy upgradeability timelocks, and check audit reports from CertiK, OpenZeppelin, or Trail of Bits.",
      metric: "Explorer Verification & Timelock Status",
    },
    {
      step: "02",
      title: "Core Team & GitHub Development Cadence",
      icon: "👥",
      desc: "Evaluation of developer commit frequency, code freshness, institutional venture backing, and public leadership track records.",
      metric: "Active GitHub Repos & Public Commits",
    },
    {
      step: "03",
      title: "Tokenomics & Airdrop Allocation Model",
      icon: "📊",
      desc: "Analysis of total supply distribution, insider lockups, community pool percentages, and anti-dumping vesting cliffs.",
      metric: "Community Allocation >= 10%",
    },
    {
      step: "04",
      title: "Gas Efficiency & Capital Requirements",
      icon: "⛽",
      desc: "Clear documentation of estimated gas costs, mandatory minimum deposits, and risk-adjusted ROI expectations.",
      metric: "Zero Pay-to-Win Exploits",
    },
    {
      step: "05",
      title: "Continuous Telemetry & Lifecycle Monitoring",
      icon: "📡",
      desc: "Post-publication RPC indexing to track snapshot block heights, contract deprecations, and point system updates.",
      metric: "24/7 Node State Monitoring",
    },
  ];

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 940, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Methodology
        </div>

        <MotionFade delay={0.05} direction="up" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge">🔬 Scientific Vetting Framework</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 16px" }}>
            Our 5-Step Evaluation Methodology
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--muted)", maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            A rigorous, multi-chain vetting framework designed to filter out fraudulent schemes and rank authentic Web3 opportunities.
          </p>
        </MotionFade>

        {/* 5-Step Radar Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 48 }}>
          {steps.map((item, idx) => (
            <MotionCard key={idx} style={{ padding: 28 }}>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(124, 92, 255, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {item.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--accent)", fontWeight: 800, textTransform: "uppercase" }}>
                      Phase {item.step}
                    </span>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "2px 0 0" }}>{item.title}</h2>
                  </div>
                </div>
                <span className="pill-badge success" style={{ fontSize: "0.75rem" }}>
                  {item.metric}
                </span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                {item.desc}
              </p>
            </MotionCard>
          ))}
        </div>

        {/* Risk Scoring Matrix */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 20 }}>
            Risk Classification Matrix
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <MotionCard style={{ padding: 24, borderTop: "3px solid #00e0a4" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 5, background: "#00e0a4" }} />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>Low Risk / Confirmed</h3>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                Audited smart contracts, confirmed foundation governance budget, established team with verifiable GitHub activity.
              </p>
            </MotionCard>

            <MotionCard style={{ padding: 24, borderTop: "3px solid #ffb547" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 5, background: "#ffb547" }} />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>Moderate Risk / Points</h3>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                Active points campaign, unconfirmed tokenomics snapshot, contract upgrades possible via multi-sig timelocks.
              </p>
            </MotionCard>

            <MotionCard style={{ padding: 24, borderTop: "3px solid #ff5c7c" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 5, background: "#ff5c7c" }} />
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>High Risk / Testnet</h3>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                Early experimental code, un-audited testnet contracts. Strict zero-real-funds isolation recommended.
              </p>
            </MotionCard>
          </div>
        </div>

        {/* Footer Navigation */}
        <MotionCard style={{ padding: 28, textAlign: "center" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>Have a Protocol for Review?</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 20 }}>
            Submit your protocol&apos;s smart contract addresses and audit documentation for consideration.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
            <Link href="/contact" className="btn btn-primary" style={{ fontSize: "0.85rem" }}>
              Submit for Vetting
            </Link>
            <Link href="/editorial-policy" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              Editorial Guidelines
            </Link>
          </div>
        </MotionCard>
      </div>
    </section>
  );
}
