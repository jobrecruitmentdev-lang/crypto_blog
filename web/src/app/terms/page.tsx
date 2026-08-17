import type { Metadata } from "next";
import Link from "next/link";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Terms of Service — User Agreement & Usage Conditions",
  description: "Crypto Airdrop AI terms of service: user agreement, limitation of liability, non-financial advice notices, and acceptable use policy.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Terms of Service", "item": "https://cryptoairdropai.com/terms" }
    ]
  };

  const sections = [
    { id: "agreement", label: "1. Agreement to Terms" },
    { id: "non-financial", label: "2. Non-Financial Advice" },
    { id: "no-warranty", label: "3. No Reward Warranty" },
    { id: "liability", label: "4. Limitation of Liability" },
    { id: "ip", label: "5. Intellectual Property" },
  ];

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Terms of Service
        </div>

        <MotionFade delay={0.05} direction="up" style={{ marginBottom: 36 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge">📜 Web3 User Terms</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 12px" }}>
            Terms of Service
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
            Last updated: August 15, 2026 · User Conditions &amp; Disclaimers
          </p>
        </MotionFade>

        {/* 2-Column Layout with Sticky TOC */}
        <div className="page-two-col">
          <div className="toc-sticky">
            <div style={{ fontSize: "0.85rem", fontWeight: 800, textTransform: "uppercase", color: "var(--accent)", marginBottom: 12 }}>
              Table of Contents
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {sections.map((sec) => (
                <a key={sec.id} href={`#${sec.id}`} className="toc-link">
                  {sec.label}
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <MotionCard id="agreement" style={{ padding: 28 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
                1. Agreement to Terms
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                By accessing and utilizing Crypto Airdrop AI (cryptoairdropai.com), you acknowledge and agree to comply with these Terms of Service. If you disagree with any part, you must discontinue use immediately.
              </p>
            </MotionCard>

            <MotionCard id="non-financial" style={{ padding: 28, borderLeft: "4px solid var(--accent)" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
                2. Non-Financial Advice &amp; Educational Purpose
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                All content, guides, and metrics provided are strictly for informational and educational purposes. Nothing constitutes financial or legal advice. You assume 100% of the financial and technical risk associated with any transactions.
              </p>
            </MotionCard>

            <MotionCard id="no-warranty" style={{ padding: 28 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
                3. No Warranty on Airdrops or Rewards
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                Crypto Airdrop AI does not issue tokens, sponsor distributions, or guarantee any specific airdrop allocation. Project developers reserve sole authority to alter eligibility criteria.
              </p>
            </MotionCard>

            <MotionCard id="liability" style={{ padding: 28 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
                4. Limitation of Liability
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                Under no circumstances shall Crypto Airdrop AI, its analysts, or contributors be held liable for any direct or indirect losses, including smart contract bugs, phishing attacks, or gas fees incurred.
              </p>
            </MotionCard>

            <MotionCard id="ip" style={{ padding: 28 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
                5. Intellectual Property
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                All original written research, diagrams, and custom UI components are the intellectual property of Crypto Airdrop AI. Unauthorized automated scraping without attribution is prohibited.
              </p>
            </MotionCard>
          </div>
        </div>
      </div>
    </section>
  );
}
