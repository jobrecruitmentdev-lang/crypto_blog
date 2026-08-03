import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "CryptoDrop is a free crypto airdrop aggregator that verifies and tracks token distributions across every major blockchain.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <section className="section">
      <div className="wrap edu-content">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / About
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>About CryptoDrop</h2>
        <p style={{ color: "var(--muted)", marginBottom: 16 }}>
          CryptoDrop is a free aggregator that helps crypto users discover legitimate airdrop
          opportunities across Ethereum, Solana, Layer 2 networks and beyond. We don&apos;t run the
          listed airdrops — we research, verify, and document them so you don&apos;t have to dig
          through Discord servers and Twitter threads.
        </p>

        <h3 style={{ fontSize: 20, margin: "24px 0 8px", fontWeight: 700 }}>What We Do</h3>
        <ul style={{ paddingLeft: 18, listStyle: "disc", color: "var(--muted)" }}>
          <li>Track new and ongoing airdrops daily across major chains</li>
          <li>Write step-by-step farming guides with realistic reward estimates</li>
          <li>Flag confirmed vs. speculative opportunities clearly</li>
          <li>Publish educational content on wallet safety and sybil avoidance</li>
        </ul>

        <h3 style={{ fontSize: 20, margin: "24px 0 8px", fontWeight: 700 }}>Our Approach</h3>
        <p style={{ color: "var(--muted)", marginBottom: 16 }}>
          We prioritize projects with real funding, active development, and genuine community
          traction over low-effort &quot;airdrop farms.&quot; Our team reviews new listings before
          publication and updates existing guides as project status changes.
        </p>

        <h3 style={{ fontSize: 20, margin: "24px 0 8px", fontWeight: 700 }}>Disclaimer</h3>
        <p style={{ color: "var(--muted)" }}>
          Nothing on this site is financial advice. Always do your own research, use dedicated
          wallets for farming, and never share your private keys or seed phrase with anyone.
        </p>
      </div>
    </section>
  );
}
