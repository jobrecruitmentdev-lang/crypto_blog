import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Financial & Affiliate Disclaimer — Not Financial Advice",
  description:
    "Official risk disclosures, non-financial advice notices (NFA/DYOR), smart contract risk warnings, and FTC affiliate disclosures for Crypto Airdrop AI.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Disclaimer", "item": "https://cryptoairdropai.com/disclaimer" }
    ]
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 20 }}>
          <Link href="/">Home</Link> / Disclaimer
        </div>

        <div className="section-head" style={{ marginBottom: 32 }}>
          <div>
            <span style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Regulatory &amp; Risk Disclosures
            </span>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginTop: 8, letterSpacing: "-0.02em" }}>
              Financial &amp; Affiliate Disclaimer
            </h1>
            <p style={{ fontSize: "1.15rem", color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>
              Please read this disclaimer carefully before using Crypto Airdrop AI (cryptoairdropai.com) or engaging with any listed protocols.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 32, borderLeft: "4px solid #f59e0b", background: "var(--surface)" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#f59e0b", marginBottom: 8 }}>
            ⚠️ Important Summary: Not Financial Advice (NFA)
          </h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
            Nothing published on Crypto Airdrop AI constitutes financial, investment, legal, or tax advice. All content is authored strictly for informational, educational, and research purposes. Cryptocurrency transactions, token airdrops, and DeFi protocols carry substantial financial and smart contract risk.
          </p>
        </div>

        <div style={{ marginBottom: 36, lineHeight: 1.8 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 14 }}>1. Do Your Own Research (DYOR)</h2>
          <p style={{ color: "var(--muted)", marginBottom: 14 }}>
            Crypto Airdrop AI provides aggregated information, news summaries, and technical walkthroughs. We do not endorse, guarantee, or sponsor any third-party protocol, smart contract, or airdrop listed on this platform.
          </p>
          <p style={{ color: "var(--muted)" }}>
            Token eligibility, reward amounts, and distribution dates are determined exclusively by independent third-party blockchain foundations and protocol developers. Crypto Airdrop AI has zero control over whether any project successfully delivers a token.
          </p>
        </div>

        <div style={{ marginBottom: 36, lineHeight: 1.8 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 14 }}>2. Blockchain &amp; Smart Contract Risks</h2>
          <p style={{ color: "var(--muted)", marginBottom: 14 }}>
            Interacting with decentralized applications (dApps), testnets, liquidity pools, and bridging contracts involves significant technical hazards:
          </p>
          <ul style={{ paddingLeft: 20, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 8 }}>
            <li><strong>Smart Contract Vulnerabilities:</strong> Even audited protocols may contain unknown software exploits resulting in partial or total loss of deposited capital.</li>
            <li><strong>Phishing &amp; Malicious Approvals:</strong> Scammers often clone official project frontends. Always verify contract addresses and revoke unlimited token allowances.</li>
            <li><strong>Gas Fee Volatility:</strong> Completing testnet or mainnet tasks requires network gas fees. Gas fees are non-refundable regardless of airdrop qualification.</li>
            <li><strong>Regulatory Uncertainty:</strong> Cryptocurrency regulations vary globally. You are responsible for ensuring compliance with your local laws.</li>
          </ul>
        </div>

        <div style={{ marginBottom: 36, lineHeight: 1.8 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 14 }}>3. FTC Affiliate &amp; Advertising Disclosure</h2>
          <p style={{ color: "var(--muted)", marginBottom: 14 }}>
            In compliance with FTC guidelines, please note that Crypto Airdrop AI may occasionally feature referral links or affiliate partnerships for select non-custodial tools, hardware wallets, or analytics services.
          </p>
          <p style={{ color: "var(--muted)" }}>
            If you click on an affiliate link and create an account or purchase a product, Crypto Airdrop AI may receive a modest commission at zero additional cost to you. This compensation does not influence our editorial ratings, risk classifications, or objective protocol reviews.
          </p>
        </div>

        <div style={{ marginBottom: 36, lineHeight: 1.8 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 14 }}>4. Tax Disclaimer</h2>
          <p style={{ color: "var(--muted)" }}>
            In many jurisdictions, cryptocurrency airdrops, rewards, and staking yields represent taxable events based on fair market value at the time of receipt. Crypto Airdrop AI does not offer tax advisory services. Consult a qualified, licensed CPA or tax attorney in your jurisdiction for personalized tax advice.
          </p>
        </div>

        <div className="card" style={{ padding: 20, background: "var(--surface)" }}>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", margin: 0 }}>
            Questions regarding our disclaimer policies can be addressed to <a href="mailto:legal@cryptoairdropai.com" style={{ color: "var(--primary)" }}>legal@cryptoairdropai.com</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
