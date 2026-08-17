import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer style={{ background: "#020408", borderTop: "1px solid var(--border)", paddingTop: 60, paddingBottom: 36, marginTop: 70 }}>
      <div className="wrap">
        
        {/* Top E-E-A-T Trust Telemetry Strip */}
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            padding: "20px 24px",
            background: "rgba(10, 17, 34, 0.6)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            marginBottom: 48,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--cyan-glow)", color: "var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
              🛡️
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-bright)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Non-Custodial Portal</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Zero private key requests · 100% read-only telemetry</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--emerald-glow)", color: "var(--emerald)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
              🔬
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-bright)", textTransform: "uppercase", letterSpacing: "0.04em" }}>5-Stage Audit Standard</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Every smart contract vetted before listing</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--amber-glow)", color: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>
              📜
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-bright)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Strict Editorial Integrity</div>
              <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Zero paid shilling · Peer-reviewed analysis</div>
            </div>
          </div>
        </div>

        {/* 4-Column Footer Navigation Matrix */}
        <div className="footer-grid">
          
          {/* Brand Column */}
          <div className="footer-brand">
            <Link className="logo" href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <Image src="/logo-primary.svg" alt="Crypto Airdrop AI" width={195} height={34} />
            </Link>
            <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.65, margin: "12px 0 20px" }}>
              The decentralized authority for verified crypto token airdrops, multi-chain protocol guides, and Web3 security telemetry. Built with zero-custody guarantees.
            </p>
            
            {/* Verified Social Channels */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <a
                href="https://twitter.com/cryptoairdropai"
                target="_blank"
                rel="noopener noreferrer"
                className="tui-panel"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "var(--text-bright)",
                  textDecoration: "none",
                  border: "1px solid var(--border)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X (Twitter)
              </a>

              <a
                href="https://t.me/cryptoairdropai"
                target="_blank"
                rel="noopener noreferrer"
                className="tui-panel"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "var(--cyan)",
                  textDecoration: "none",
                  border: "1px solid var(--border)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                Telegram Alpha
              </a>
            </div>
          </div>

          {/* Research & Guides Column */}
          <div className="footer-col">
            <h4>[ Intelligence &amp; Guides ]</h4>
            <ul>
              <li><Link href="/blog">Market Intelligence Feed</Link></li>
              <li><Link href="/guides">Step-by-Step Farming Guides</Link></li>
              <li><Link href="/guides/setting-up-a-farming-wallet">Wallet Isolation Manual</Link></li>
              <li><Link href="/guides/avoiding-sybil-detection">Sybil Defense Playbook</Link></li>
              <li><Link href="/guides/bridging-to-layer-2-networks">Layer-2 Bridging Guide</Link></li>
              <li><Link href="/faq">Protocol Security FAQ</Link></li>
            </ul>
          </div>

          {/* Trust & E-E-A-T Column */}
          <div className="footer-col">
            <h4>[ Trust &amp; E-E-A-T ]</h4>
            <ul>
              <li><Link href="/about">About Us &amp; Mission</Link></li>
              <li><Link href="/authors">Our AI &amp; Human Analysts</Link></li>
              <li><Link href="/editorial-policy">Editorial Policy &amp; Ethics</Link></li>
              <li><Link href="/methodology">5-Stage Audit Framework</Link></li>
              <li><Link href="/contact">Editorial &amp; Corrections Desk</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance Column */}
          <div className="footer-col">
            <h4>[ Legal &amp; Compliance ]</h4>
            <ul>
              <li><Link href="/disclaimer">Financial &amp; Risk Disclaimer</Link></li>
              <li><Link href="/privacy">Privacy Policy (GDPR / CCPA)</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/sitemap.xml">XML Sitemap Protocol</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Legal Disclosures */}
        <div className="footer-bottom" style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)", maxWidth: 680, lineHeight: 1.5 }}>
            <span style={{ color: "var(--cyan)", fontWeight: 800 }}>DISCLAIMER:</span> Crypto Airdrop AI (cryptoairdropai.com) is an educational research portal. We never solicit private keys, seed phrases, or custody assets. All content is for informational purposes only and does not constitute financial, investment, or legal advice.
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: "0.75rem", fontFamily: "monospace" }}>
            <span style={{ color: "var(--emerald)" }}>● 100% INDEPENDENT</span>
            <span style={{ color: "var(--cyan)" }}>● NO SPONSORED LISTINGS</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
