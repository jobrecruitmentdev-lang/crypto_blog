import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Editorial Desk, Security & Inquiries",
  description:
    "Get in touch with Crypto Airdrop AI. Submit editorial corrections, submit new airdrops for review, or reach our security desk.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Crypto Airdrop AI",
    "url": "https://cryptoairdropai.com/contact",
    "description": "Official contact hub for Crypto Airdrop AI editorial, support, and business inquiries.",
    "mainEntity": {
      "@type": "Organization",
      "name": "Crypto Airdrop AI",
      "url": "https://cryptoairdropai.com",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "email": "editorial@cryptoairdropai.com",
          "contactType": "Editorial & Corrections Desk",
          "availableLanguage": ["English"]
        },
        {
          "@type": "ContactPoint",
          "email": "security@cryptoairdropai.com",
          "contactType": "Security & Vulnerability Reporting",
          "availableLanguage": ["English"]
        },
        {
          "@type": "ContactPoint",
          "email": "contact@cryptoairdropai.com",
          "contactType": "General Inquiries & Submissions",
          "availableLanguage": ["English"]
        }
      ]
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Contact Us", "item": "https://cryptoairdropai.com/contact" }
    ]
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap">
        <div className="breadcrumb" style={{ marginBottom: 20 }}>
          <Link href="/">Home</Link> / Contact Us
        </div>
        <div className="section-head" style={{ marginBottom: 32 }}>
          <div>
            <span style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Get In Touch
            </span>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginTop: 8, letterSpacing: "-0.02em" }}>
              Contact Crypto Airdrop AI
            </h1>
            <p style={{ fontSize: "1.1rem", color: "var(--muted)", marginTop: 6 }}>
              Editorial corrections, protocol submissions, or research questions — our analysts respond within 24–48 hours.
            </p>
          </div>
        </div>

        <div className="contact-grid">
          <ContactForm />
          <div className="contact-info">
            <div className="info-item">
              <div className="ic">📰</div>
              <div>
                <b>Editorial &amp; Fact-Checking Desk</b>
                <br />
                <span style={{ color: "var(--muted)", fontSize: 14 }}>
                  editorial@cryptoairdropai.com
                </span>
                <br />
                <span style={{ color: "var(--primary)", fontSize: 12, fontWeight: 600 }}>
                  For corrections &amp; research inquiries
                </span>
              </div>
            </div>

            <div className="info-item">
              <div className="ic">🛡️</div>
              <div>
                <b>Security &amp; Exploit Reporting</b>
                <br />
                <span style={{ color: "var(--muted)", fontSize: 14 }}>
                  security@cryptoairdropai.com
                </span>
                <br />
                <span style={{ color: "var(--primary)", fontSize: 12, fontWeight: 600 }}>
                  High-priority vulnerability disclosures
                </span>
              </div>
            </div>

            <div className="info-item">
              <div className="ic">📢</div>
              <div>
                <b>Airdrop &amp; Protocol Submissions</b>
                <br />
                <span style={{ color: "var(--muted)", fontSize: 14 }}>
                  Include whitepaper, verified contract &amp; chain
                </span>
              </div>
            </div>

            <div className="info-item">
              <div className="ic">💬</div>
              <div>
                <b>Community Channels</b>
                <br />
                <span style={{ color: "var(--muted)", fontSize: 14 }}>
                  Twitter/X: <a href="https://twitter.com/cryptoairdropai" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>@cryptoairdropai</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
