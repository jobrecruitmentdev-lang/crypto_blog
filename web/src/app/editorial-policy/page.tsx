import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial Policy & Fact-Checking Standards",
  description:
    "Explore the editorial guidelines, fact-checking methodology, corrections policy, and AI-assisted content ethics of Crypto Airdrop AI.",
  alternates: { canonical: "/editorial-policy" },
};

export default function EditorialPolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Editorial Policy", "item": "https://cryptoairdropai.com/editorial-policy" }
    ]
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 20 }}>
          <Link href="/">Home</Link> / Editorial Policy
        </div>

        <div className="section-head" style={{ marginBottom: 32 }}>
          <div>
            <span style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Trust &amp; Accuracy
            </span>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginTop: 8, letterSpacing: "-0.02em" }}>
              Editorial Policy &amp; Integrity Standards
            </h1>
            <p style={{ fontSize: "1.15rem", color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>
              Our commitment to independent research, on-chain verification, rigorous fact-checking, and transparent AI governance.
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: 28, marginBottom: 36, background: "var(--surface)" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: 12 }}>1. Editorial Independence Mandate</h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
            Crypto Airdrop AI maintains strict separation between our research desk and commercial operations. Our writers, researchers, and technical contributors do not accept compensation, token allocations, or preferential allocations in exchange for positive reviews, favorable status tags, or biased guides.
          </p>
        </div>

        <div style={{ marginBottom: 36, lineHeight: 1.8 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 16 }}>2. Primary Source Fact-Checking Protocol</h2>
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>
            Every guide, analysis, and airdrop listing published on Crypto Airdrop AI must undergo a mandatory 4-stage verification process:
          </p>
          <ol style={{ paddingLeft: 20, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 12 }}>
            <li>
              <strong>Cryptographic Verification:</strong> All official project announcements must originate from verified cryptographic channels (official domain DNS records, verified GitHub commits, signed developer messages, or verified protocol smart contracts).
            </li>
            <li>
              <strong>On-Chain Replication:</strong> Step-by-step instructions (such as bridging, liquidity provision, or staking) are physically tested on testnet/mainnet environments by our research team to confirm contract accuracy and identify potential failure points.
            </li>
            <li>
              <strong>Smart Contract Safety Review:</strong> Contract addresses are cross-referenced with block explorers (Etherscan, Solscan, Arbiscan) to verify source code verification status, proxy upgradeability timelocks, and audit histories.
            </li>
            <li>
              <strong>Peer Review &amp; Approval:</strong> Content is peer-reviewed by a designated Senior Analyst before publication.
            </li>
          </ol>
        </div>

        <div style={{ marginBottom: 36, lineHeight: 1.8 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 16 }}>3. AI-Assisted Research &amp; Human Governance</h2>
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>
            We leverage automated data scraping and machine-learning analysis to monitor on-chain volume anomalies, gas fluctuations, and developer commits. However, we adhere to strict ethical AI standards:
          </p>
          <ul style={{ paddingLeft: 20, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 8 }}>
            <li>No article, review, or risk rating is published solely by an AI model without human review.</li>
            <li>All technical claims, statistics, and step-by-step guides are validated by named human analysts.</li>
            <li>We do not publish regurgitated or unverified synthetic content.</li>
          </ul>
        </div>

        <div style={{ marginBottom: 36, lineHeight: 1.8 }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 16 }}>4. Corrections &amp; Update Policy</h2>
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>
            In the fast-paced Web3 landscape, blockchain protocols and snapshot rules evolve rapidly. When a factual inaccuracy, broken contract link, or updated snapshot date is discovered:
          </p>
          <ul style={{ paddingLeft: 20, color: "var(--muted)", display: "flex", flexDirection: "column", gap: 8 }}>
            <li>We correct the information immediately upon verification.</li>
            <li>We transparently update the &quot;Last Updated&quot; timestamp on the respective page.</li>
            <li>Readers can submit correction requests directly via <Link href="/contact" style={{ color: "var(--primary)", fontWeight: 700 }}>editorial@cryptoairdropai.com</Link>.</li>
          </ul>
        </div>

        <div className="card" style={{ padding: 24, background: "var(--surface)", borderLeft: "4px solid var(--primary)" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 8 }}>Questions or Editorial Inquiries?</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
            Reach out to our Editorial Desk at <a href="mailto:editorial@cryptoairdropai.com" style={{ color: "var(--primary)" }}>editorial@cryptoairdropai.com</a> or visit our <Link href="/contact" style={{ color: "var(--primary)" }}>Contact Hub</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
