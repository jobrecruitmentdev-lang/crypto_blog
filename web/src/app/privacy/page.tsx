import type { Metadata } from "next";
import Link from "next/link";
import { MotionCard, MotionFade } from "@/components/ui/MotionWrapper";

export const metadata: Metadata = {
  title: "Privacy Policy — Data Protection & Web3 Non-Custodial Terms",
  description: "Crypto Airdrop AI privacy policy: data protection practices, non-custodial wallet terms, cookie policy, and user rights under GDPR/CCPA.",
  alternates: { canonical: "/privacy/" },
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

  const sections = [
    { id: "non-custodial", label: "1. Non-Custodial Guarantee" },
    { id: "collection", label: "2. Data Collection" },
    { id: "cookies", label: "3. Cookies & Analytics" },
    { id: "third-party", label: "4. Third-Party Links" },
    { id: "gdpr-ccpa", label: "5. User Rights (GDPR/CCPA)" },
  ];

  return (
    <section className="section" style={{ position: "relative" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 24 }}>
          <Link href="/">Home</Link> / Privacy Policy
        </div>

        <MotionFade delay={0.05} direction="up" style={{ marginBottom: 36 }}>
          <div style={{ display: "inline-flex", marginBottom: 12 }}>
            <span className="pill-badge success">🔒 Non-Custodial Data Guarantee</span>
          </div>
          <h1 style={{ fontSize: "2.8rem", fontWeight: 900, letterSpacing: "-0.03em", margin: "8px 0 12px" }}>
            Privacy Policy &amp; Data Rights
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem" }}>
            Last updated: August 15, 2026 · Compliant with GDPR &amp; CCPA
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
            <MotionCard id="non-custodial" style={{ padding: 28, borderLeft: "4px solid var(--accent2)" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
                1. Non-Custodial &amp; Zero-Key Collection Principle
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                Crypto Airdrop AI (cryptoairdropai.com) is a strictly non-custodial research platform. We never ask for, collect, store, or transmit your private keys, recovery seed phrases, or wallet credentials.
              </p>
            </MotionCard>

            <MotionCard id="collection" style={{ padding: 28 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
                2. Information We Collect
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                We collect basic aggregate website analytics (anonymized page views, approximate geographic region, browser version, and referral paths) to maintain performance and optimize user experience.
              </p>
            </MotionCard>

            <MotionCard id="cookies" style={{ padding: 28 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
                3. Cookies &amp; Tracking Technologies
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                We utilize essential technical cookies for site theme preferences (light/dark mode) and anonymized traffic metrics. You may block cookies through your browser settings without restricting content.
              </p>
            </MotionCard>

            <MotionCard id="third-party" style={{ padding: 28 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
                4. Third-Party Links &amp; Outbound Networks
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                Our platform links to external decentralized applications and block explorers. We do not control and are not responsible for the privacy practices or contract security of third-party domains.
              </p>
            </MotionCard>

            <MotionCard id="gdpr-ccpa" style={{ padding: 28 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 8 }}>
                5. User Rights Under GDPR &amp; CCPA
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: "0 0 12px" }}>
                You have the right to request access to or permanent deletion of any personal data held by Crypto Airdrop AI. To exercise these rights, email us directly:
              </p>
              <a href="mailto:privacy@cryptoairdropai.com" style={{ color: "var(--accent)", fontWeight: 700 }}>
                privacy@cryptoairdropai.com
              </a>
            </MotionCard>
          </div>
        </div>
      </div>
    </section>
  );
}
