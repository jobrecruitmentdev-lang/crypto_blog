import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Evaluation Methodology & Protocol Risk Scoring Framework",
  description:
    "Discover how Crypto Airdrop AI researches, audits, and rates crypto airdrops, DeFi protocols, and smart contract distributions.",
  alternates: { canonical: "/methodology" },
};

export default function MethodologyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Methodology", "item": "https://cryptoairdropai.com/methodology" }
    ]
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="wrap" style={{ maxWidth: 860, margin: "0 auto" }}>
        <div className="breadcrumb" style={{ marginBottom: 20 }}>
          <Link href="/">Home</Link> / Methodology
        </div>

        <div className="section-head" style={{ marginBottom: 32 }}>
          <div>
            <span style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Scientific Vetting
            </span>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 900, marginTop: 8, letterSpacing: "-0.02em" }}>
              Our 5-Step Evaluation Methodology
            </h1>
            <p style={{ fontSize: "1.15rem", color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>
              A systematic, on-chain evaluation framework designed to filter out fraudulent schemes and rank authentic Web3 opportunities.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 40 }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ width: 36, height: 36, borderRadius: 18, background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                1
              </span>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>
                Smart Contract &amp; Architecture Audit
              </h2>
            </div>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
              Before listing any project, we verify that contract code is publicly verified on explorers (Etherscan, Solscan, etc.). We inspect multi-sig configurations, timelock delays on admin functions, and previous third-party audits from recognized security firms (e.g. OpenZeppelin, CertiK, Trail of Bits).
            </p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ width: 36, height: 36, borderRadius: 18, background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                2
              </span>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>
                Founding Team &amp; Venture Backing Verification
              </h2>
            </div>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
              We evaluate core developer backgrounds, GitHub commit cadence, and institutional backing from Tier-1 crypto venture funds (e.g. Paradigm, a16z crypto, Polychain). Anonymous teams undergo enhanced scrutiny regarding code provenance and multi-sig security.
            </p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ width: 36, height: 36, borderRadius: 18, background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                3
              </span>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>
                Tokenomics &amp; Community Allocation Viability
              </h2>
            </div>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
              We analyze the proposed tokenomics: total supply, community airdrop allocation percentage (typically 5%–15% for tier-1 protocols), vesting schedules, and whether points systems have transparent conversion metrics.
            </p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ width: 36, height: 36, borderRadius: 18, background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                4
              </span>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>
                Capital Efficiency &amp; Gas Cost Risk Assessment
              </h2>
            </div>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
              We calculate the estimated gas expenditures required to complete ongoing tasks versus the estimated reward potential. Projects requiring disproportionate gas fees with negligible reward probability are explicitly flagged with elevated risk warnings.
            </p>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ width: 36, height: 36, borderRadius: 18, background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                5
              </span>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 800, margin: 0 }}>
                Continuous Lifecycle &amp; Status Monitoring
              </h2>
            </div>
            <p style={{ color: "var(--muted)", lineHeight: 1.7, margin: 0 }}>
              Our data scrapers and analysts continually monitor snapshot announcements. As soon as a snapshot occurs, or a project winds down, our listings are updated to reflect the new state (e.g. from Ongoing to Claim Live or Expired).
            </p>
          </div>
        </div>

        <div className="card" style={{ padding: 24, background: "var(--surface)", borderLeft: "4px solid var(--primary)" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: 8 }}>Have a project or protocol to submit for review?</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
            Submit contract details and documentation through our <Link href="/contact" style={{ color: "var(--primary)" }}>Submission Desk</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
