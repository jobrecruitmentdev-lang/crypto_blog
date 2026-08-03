import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "CryptoDrop terms of service and disclaimer.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="section">
      <div className="wrap edu-content">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Terms of Service
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Terms of Service</h2>
        <p style={{ color: "var(--muted)", marginBottom: 8 }}>Last updated: July 18, 2026</p>

        <h3 style={{ fontSize: 18, margin: "24px 0 8px", fontWeight: 700 }}>No Financial Advice</h3>
        <p style={{ color: "var(--muted)" }}>
          CryptoDrop is an informational aggregator. Nothing published here constitutes financial,
          investment, or legal advice. Cryptocurrency airdrops carry risk, including scams and
          total loss of funds.
        </p>

        <h3 style={{ fontSize: 18, margin: "24px 0 8px", fontWeight: 700 }}>No Endorsement</h3>
        <p style={{ color: "var(--muted)" }}>
          We do not run, operate, or guarantee any listed airdrop or project. Listing a project
          does not constitute an endorsement. Always verify official links independently.
        </p>

        <h3 style={{ fontSize: 18, margin: "24px 0 8px", fontWeight: 700 }}>Use at Your Own Risk</h3>
        <p style={{ color: "var(--muted)" }}>
          You are solely responsible for any wallet connections, transactions, or tasks you
          complete after visiting a project linked from this site.
        </p>

        <h3 style={{ fontSize: 18, margin: "24px 0 8px", fontWeight: 700 }}>Changes to These Terms</h3>
        <p style={{ color: "var(--muted)" }}>
          We may update these terms at any time. Continued use of the site constitutes acceptance
          of the current terms.
        </p>
      </div>
    </section>
  );
}
