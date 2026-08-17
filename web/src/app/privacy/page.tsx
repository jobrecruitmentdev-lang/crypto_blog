import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Data Protection & Web3 Non-Custodial Terms",
  description: "Crypto Airdrop AI privacy policy: data protection practices, non-custodial wallet terms, cookie policy, and user rights under GDPR/CCPA.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": "https://cryptoairdropai.com/privacy" }
    ]
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap edu-content" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 20 }}>
          <Link href="/">Home</Link> / Privacy Policy
        </div>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginBottom: 8, letterSpacing: "-0.02em" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: "0.95rem" }}>
          Last updated: August 15, 2026
        </p>

        <div className="card" style={{ padding: 24, marginBottom: 28, background: "var(--surface)" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>1. Non-Custodial &amp; Zero-Key Collection Principle</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
            Crypto Airdrop AI (cryptoairdropai.com) is a strictly non-custodial informational research platform. We never ask for, collect, store, or transmit your private keys, recovery seed phrases, or wallet credentials.
          </p>
        </div>

        <h2 style={{ fontSize: "1.35rem", margin: "28px 0 10px", fontWeight: 800 }}>2. Information We Collect</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          We collect basic aggregate website analytics (anonymized page views, approximate geographic region, browser version, and referral paths) to maintain performance and optimize user experience. If you subscribe to our newsletter or contact our desk, we store only your voluntarily submitted email address.
        </p>

        <h2 style={{ fontSize: "1.35rem", margin: "28px 0 10px", fontWeight: 800 }}>3. Cookies &amp; Tracking Technologies</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          We utilize essential technical cookies for site theme preferences (light/dark mode) and anonymized traffic metrics. You may block or delete cookies through your browser settings without restricting core content access.
        </p>

        <h2 style={{ fontSize: "1.35rem", margin: "28px 0 10px", fontWeight: 800 }}>4. Third-Party Links &amp; Outbound Networks</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          Our platform links to external decentralized applications, blockchain explorers, and third-party protocol websites. We do not control and are not responsible for the privacy practices, contract security, or content of third-party domains.
        </p>

        <h2 style={{ fontSize: "1.35rem", margin: "28px 0 10px", fontWeight: 800 }}>5. User Rights Under GDPR &amp; CCPA</h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          You have the right to request access to, rectification of, or permanent deletion of any personal data (such as newsletter email records) held by Crypto Airdrop AI. To exercise these rights, email <a href="mailto:privacy@cryptoairdropai.com" style={{ color: "var(--primary)" }}>privacy@cryptoairdropai.com</a>.
        </p>
      </div>
    </section>
  );
}
