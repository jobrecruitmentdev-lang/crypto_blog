import type { Metadata } from "next";
import Link from "next/link";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";
import ArticleCardGrid from "@/components/ArticleCardGrid";
import { getArticles } from "@/lib/contentStore";

export const metadata: Metadata = {
  title: "Editorial Policy & Fact-Checking Standards",
  description:
    "Explore the editorial guidelines, fact-checking methodology, corrections policy, and AI-assisted content ethics of Crypto Airdrop AI.",
  alternates: { canonical: "/editorial-policy/" },
};

export default async function EditorialPolicyPage() {
  const articles = await getArticles("editorial");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Editorial Policy", "item": "https://cryptoairdropai.com/editorial-policy/" }
    ]
  };

  const steps = [
    {
      num: "01",
      title: "Cryptographic Source Ingestion",
      desc: "All protocol announcements must originate from verifiable DNS records, signed developer commits, or verified smart contracts.",
      badge: "Cryptographic Ingestion",
    },
    {
      num: "02",
      title: "Testnet / Mainnet Simulation",
      desc: "Our technical nodes execute qualifying deposit or interaction steps directly to evaluate gas consumption and contract approvals.",
      badge: "On-Chain Simulation",
    },
    {
      num: "03",
      title: "Sybil & Security Audit",
      desc: "Code repositories and audit reports are scanned for malicious proxy patterns, honeypots, or centralized rug-pull attack vectors.",
      badge: "Security Filter",
    },
    {
      num: "04",
      title: "Human Editorial Peer Review",
      desc: "Before publication, research leads verify plain-language clarity, risk disclaimers, and step-by-step reproducibility.",
      badge: "Peer Review",
    },
  ];

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 960, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Editorial Policy &amp; Standards
        </div>

        <MotionFade delay={0.05} direction="up" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge success">🛡️ Integrity &amp; Transparency Mandate</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 16px" }}>
            Editorial Policy &amp; Ethics
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--muted)", maxWidth: 720, margin: "0 auto", lineHeight: 1.6 }}>
            Our binding charter for fact-checking, zero sponsored listings, and algorithmic non-custodial research.
          </p>
        </MotionFade>

        {/* 4 Pillars Bento Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 54 }}>
          {steps.map((item, idx) => (
            <MotionCard key={idx} style={{ padding: 28 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--accent)" }}>{item.num}</span>
                <span className="pill-badge" style={{ fontSize: "0.72rem" }}>{item.badge}</span>
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 10px" }}>{item.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.93rem", lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </MotionCard>
          ))}
        </div>

        {/* 8K Editorial Articles Section */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 900, margin: 0 }}>
                Editorial Integrity &amp; Ethics Publications
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.92rem", margin: "4px 0 0" }}>
                Deep dives on crypto journalism standards, compliance, and regulatory disclosures
              </p>
            </div>
          </div>
          <ArticleCardGrid articles={articles} basePath="/editorial-policy/" />
        </div>

        {/* Accountability Statement */}
        <MotionCard style={{ padding: 32, textAlign: "center", background: "rgba(10, 17, 34, 0.6)" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 8 }}>Found an Inaccuracy or Outdated Information?</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", maxWidth: 640, margin: "0 auto 20px" }}>
            We guarantee a 24–48 hour turn-around for verified factual corrections.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
            <Link href="/contact/" className="btn btn-primary" style={{ fontSize: "0.85rem" }}>
              Submit Correction to Editorial Desk
            </Link>
          </div>
        </MotionCard>
      </div>
    </section>
  );
}
