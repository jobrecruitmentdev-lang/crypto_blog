import type { Metadata } from "next";
import Link from "next/link";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";
import ArticleCardGrid from "@/components/ArticleCardGrid";
import { getArticles } from "@/lib/contentStore";

export const metadata: Metadata = {
  title: "Evaluation Methodology & Protocol Risk Scoring Framework",
  description:
    "Discover how Crypto Airdrop AI researches, audits, and rates crypto airdrops, DeFi protocols, and smart contract distributions.",
  alternates: { canonical: "/methodology/" },
};

export default async function MethodologyPage() {
  const articles = await getArticles("methodology");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Methodology", "item": "https://cryptoairdropai.com/methodology/" }
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

      <div className="wrap" style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Methodology &amp; Audit Framework
        </div>

        <MotionFade delay={0.05} direction="up" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge">🔬 Quantitative Protocol Evaluation</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 16px" }}>
            The 5-Stage Audit Framework
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--muted)", maxWidth: 720, margin: "0 auto", lineHeight: 1.6 }}>
            Every crypto project cataloged on Crypto Airdrop AI must pass through our deterministic 5-stage cryptographic filter.
          </p>
        </MotionFade>

        {/* 5-Stage Framework Bento */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 54 }}>
          {steps.map((s, idx) => (
            <MotionCard key={idx} style={{ padding: "24px 28px", display: "flex", alignItems: "flex-start", gap: 20 }}>
              <div style={{ fontSize: "1.8rem", flexShrink: 0, marginTop: 2 }}>{s.icon}</div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0 }}>
                    Stage {s.step}: {s.title}
                  </h3>
                  <span className="pill-badge success" style={{ fontSize: "0.72rem" }}>
                    {s.metric}
                  </span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: "0.93rem", lineHeight: 1.6, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            </MotionCard>
          ))}
        </div>

        {/* 8K Methodology & Audit Articles Section */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 900, margin: 0 }}>
                Security &amp; Audit Research Papers
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.92rem", margin: "4px 0 0" }}>
                Deep forensic audits, bytecode analysis, and protocol risk score breakdowns
              </p>
            </div>
          </div>
          <ArticleCardGrid articles={articles} basePath="/methodology/" />
        </div>

        {/* Cross Links */}
        <MotionCard style={{ padding: 28, textAlign: "center", background: "rgba(10, 17, 34, 0.6)" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>Need to Report a Security Concern?</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 20 }}>
            Reach our Security Sentinel desk for expedited smart contract vulnerability reviews.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
            <Link href="/editorial-policy/" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              Editorial Charter
            </Link>
            <Link href="/contact/" className="btn btn-primary" style={{ fontSize: "0.85rem" }}>
              Submit Vulnerability
            </Link>
          </div>
        </MotionCard>
      </div>
    </section>
  );
}
