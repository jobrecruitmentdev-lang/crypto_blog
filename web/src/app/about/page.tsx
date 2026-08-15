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
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>About CryptoDrop</h1>
        <p style={{ color: "var(--muted)", marginBottom: 16 }}>
          CryptoDrop (cryptoairdropai.com) is an independent crypto airdrop tracker and directory. We monitor blockchain projects across Ethereum, Solana, Base, Arbitrum, and 50+ other networks, and manually verify eligibility criteria, reward estimates, and status before publishing a listing.
        </p>

        <h2 style={{ fontSize: 20, margin: "24px 0 8px", fontWeight: 700 }}>Our verification process</h2>
        <p style={{ color: "var(--muted)", marginBottom: 16 }}>
          Every project is reviewed against official announcements, on-chain activity, and funding/points-program signals before being tagged Confirmed, Ongoing, or Potential. Listings are re-checked and timestamped whenever new information becomes available.
        </p>

        <h2 style={{ fontSize: 20, margin: "24px 0 8px", fontWeight: 700 }}>What we are not</h2>
        <p style={{ color: "var(--muted)" }}>
          CryptoDrop does not issue, sell, or guarantee any token or airdrop listed on this site. We are an aggregator and research resource. Always verify official project links yourself before connecting a wallet. This content is for informational and educational purposes only and is not financial advice.
        </p>
      </div>
    </section>
  );
}
