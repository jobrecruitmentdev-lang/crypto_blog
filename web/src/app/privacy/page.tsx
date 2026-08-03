import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "CryptoDrop privacy policy: what data we collect, how it's used, and your rights.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="wrap edu-content">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Privacy Policy
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Privacy Policy</h2>
        <p style={{ color: "var(--muted)", marginBottom: 8 }}>Last updated: July 18, 2026</p>

        <h3 style={{ fontSize: 18, margin: "24px 0 8px", fontWeight: 700 }}>Information We Collect</h3>
        <p style={{ color: "var(--muted)" }}>
          We collect basic analytics data (pages visited, general location, device type) and any
          information you voluntarily submit through our contact or newsletter forms, such as your
          email address.
        </p>

        <h3 style={{ fontSize: 18, margin: "24px 0 8px", fontWeight: 700 }}>How We Use Information</h3>
        <ul style={{ paddingLeft: 18, listStyle: "disc", color: "var(--muted)" }}>
          <li>To operate and improve the site</li>
          <li>To send newsletter updates to subscribers who opt in</li>
          <li>To respond to contact form submissions</li>
        </ul>

        <h3 style={{ fontSize: 18, margin: "24px 0 8px", fontWeight: 700 }}>Cookies</h3>
        <p style={{ color: "var(--muted)" }}>
          We use cookies for basic site functionality and analytics. You can disable cookies in
          your browser settings at any time.
        </p>

        <h3 style={{ fontSize: 18, margin: "24px 0 8px", fontWeight: 700 }}>Third Parties</h3>
        <p style={{ color: "var(--muted)" }}>
          We do not sell personal data. We may share aggregated, non-identifying analytics with
          advertising partners.
        </p>

        <h3 style={{ fontSize: 18, margin: "24px 0 8px", fontWeight: 700 }}>Your Rights</h3>
        <p style={{ color: "var(--muted)" }}>
          You may request deletion of your email from our newsletter list at any time by contacting
          us.
        </p>
      </div>
    </section>
  );
}
