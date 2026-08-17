import type { Metadata } from "next";
import Link from "next/link";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Editorial Policy & Fact-Checking Standards",
  description:
    "Explore the editorial guidelines, fact-checking methodology, corrections policy, and AI-assisted content ethics of Crypto Airdrop AI.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Editorial Policy", "item": "https://cryptoairdropai.com/editorial-policy" }
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

      <div className="wrap" style={{ maxWidth: 940, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Editorial Policy
        </div>

        <MotionFade delay={0.05} direction="up" style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge success">🛡️ Integrity &amp; Transparency Mandate</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 16px" }}>
            Editorial Policy &amp; Fact-Checking Standards
          </h1>
          <p style={{ fontSize: "1.2rem", color: "var(--muted)", maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            Our commitment to verifiable research, on-chain proof of execution, and zero paid listing bias.
          </p>
        </MotionFade>

        {/* Independence Banner */}
        <MotionCard style={{ padding: 32, marginBottom: 40, borderLeft: "4px solid var(--accent)" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: 12 }}>
            1. Uncompromising Editorial Independence
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.7, margin: 0 }}>
            Crypto Airdrop AI operates under a strict firewall separating our technical research desk from external commercial entities. We do not accept sponsored tokens, paid ranking placements, or hidden bounty arrangements. Every protocol evaluated is scored strictly based on verifiable merit and security.
          </p>
        </MotionCard>

        {/* 4-Stage Fact-Checking Stepper */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: 24 }}>
            2. The 4-Stage Fact-Checking Protocol
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {steps.map((s, idx) => (
              <MotionCard key={idx} style={{ padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--accent)" }}>{s.num}</span>
                  <span className="pill-badge" style={{ fontSize: "0.75rem" }}>{s.badge}</span>
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </MotionCard>
            ))}
          </div>
        </div>

        {/* AI Transparency & Corrections */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
          <MotionCard style={{ padding: 28 }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 12 }}>🤖 AI Governance &amp; Ethics</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>
              Our AI algorithmic crawlers aggregate contract events and telemetry continuously. However, all generated guides undergo mandatory deterministic verification and technical review before being marked as Verified.
            </p>
          </MotionCard>

          <MotionCard style={{ padding: 28 }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 12 }}>⚡ Rapid Corrections Protocol</h3>
            <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7 }}>
              If a smart contract rule changes or an exploit is detected, our research desk issues transparent timestamped correction updates within 2 to 4 hours.
            </p>
          </MotionCard>
        </div>

        {/* Bottom Cross-links */}
        <MotionCard style={{ padding: 28, textAlign: "center" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>Explore Our Trust Framework</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", marginBottom: 20 }}>
            Discover our risk-scoring metrics or request a fact-checking review from our editors.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12 }}>
            <Link href="/methodology" className="btn btn-primary" style={{ fontSize: "0.85rem" }}>
              🔬 Evaluation Methodology
            </Link>
            <Link href="/authors" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              🤖 Meet the AI Nodes
            </Link>
            <Link href="/contact" className="btn btn-outline" style={{ fontSize: "0.85rem" }}>
              ✉️ Submit a Correction
            </Link>
          </div>
        </MotionCard>
      </div>
    </section>
  );
}
