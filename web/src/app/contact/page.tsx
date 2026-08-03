import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the CryptoDrop team or submit a new airdrop for review.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Contact
        </div>
        <div className="section-head">
          <div>
            <h2>Contact Us</h2>
            <p>Questions, partnerships or airdrop submissions — we read everything</p>
          </div>
        </div>

        <div className="contact-grid">
          <ContactForm />
          <div className="contact-info">
            <div className="info-item">
              <div className="ic">✉️</div>
              <div>
                <b>Email</b>
                <br />
                <span style={{ color: "var(--muted)", fontSize: 14 }}>mail@cryptodrop.example</span>
              </div>
            </div>
            <div className="info-item">
              <div className="ic">💬</div>
              <div>
                <b>Telegram</b>
                <br />
                <span style={{ color: "var(--muted)", fontSize: 14 }}>@cryptodrop</span>
              </div>
            </div>
            <div className="info-item">
              <div className="ic">📢</div>
              <div>
                <b>Submit an Airdrop</b>
                <br />
                <span style={{ color: "var(--muted)", fontSize: 14 }}>
                  Include project name, chain, and official links
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
