import type { Metadata } from "next";
import Link from "next/link";

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

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap edu-content" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 20 }}>
          <Link href="/">Home</Link> / Terms of Service
        </div>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginBottom: 8, letterSpacing: "-0.02em" }}>
          Terms of Service
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: "0.95rem" }}>
          Last updated: August 15, 2026
        </p>

        <h2 style={{ fontSize: "1.35rem", margin: "24px 0 10px", fontWeight: 800 }}>1. Agreement to Terms</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          By accessing and utilizing Crypto Airdrop AI (cryptoairdropai.com), you acknowledge and agree to comply with these Terms of Service. If you disagree with any part of these terms, you must discontinue use immediately.
        </p>

        <h2 style={{ fontSize: "1.35rem", margin: "24px 0 10px", fontWeight: 800 }}>2. Non-Financial Advice &amp; Educational Purpose</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          All content, lists, guides, and metrics provided on Crypto Airdrop AI are strictly for informational and educational purposes. Nothing on this website constitutes financial, legal, or investment advice. You assume 100% of the financial and technical risk associated with any transactions, smart contract executions, or wallet interactions.
        </p>

        <h2 style={{ fontSize: "1.35rem", margin: "24px 0 10px", fontWeight: 800 }}>3. No Warranty on Airdrops or Rewards</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          Crypto Airdrop AI does not issue tokens, sponsor distributions, or guarantee any specific airdrop allocation. Project developers and foundations reserve sole authority to alter eligibility criteria, cancel reward campaigns, or blacklist addresses.
        </p>

        <h2 style={{ fontSize: "1.35rem", margin: "24px 0 10px", fontWeight: 800 }}>4. Limitation of Liability</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          Under no circumstances shall Crypto Airdrop AI, its analysts, or contributors be held liable for any direct, indirect, incidental, or consequential losses—including but not limited to loss of crypto assets, smart contract hacks, phishing incidents, or network gas fees incurred.
        </p>

        <h2 style={{ fontSize: "1.35rem", margin: "24px 0 10px", fontWeight: 800 }}>5. Intellectual Property</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          All original written research, infographics, analysis frameworks, and custom UI components are the intellectual property of Crypto Airdrop AI. Unauthorized automated scraping or commercial reproduction without attribution is prohibited.
        </p>
      </div>
    </section>
  );
}
