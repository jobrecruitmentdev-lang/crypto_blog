import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="logo" href="/">
              <Image src="/logo-primary.svg" alt="Crypto Airdrop AI" width={160} height={32} />
            </Link>
            <p>
              Independent non-custodial crypto research portal and airdrop tracking directory. We do not issue or guarantee any tokens — always verify on-chain contracts before interacting.
            </p>
            <div className="social-row">
              <a href="https://twitter.com/cryptoairdropai" target="_blank" rel="noopener noreferrer" className="icon-btn" title="X (Twitter)">X</a>
              <a href="https://t.me/cryptoairdropai" target="_blank" rel="noopener noreferrer" className="icon-btn" title="Telegram">TG</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Intelligence &amp; Guides</h4>
            <ul>
              <li><Link href="/blog">Market Intelligence</Link></li>
              <li><Link href="/guides">Step-by-Step Guides</Link></li>
              <li><Link href="/guides/setting-up-a-farming-wallet">Wallet Security Guide</Link></li>
              <li><Link href="/guides/avoiding-sybil-detection">Sybil Defense Playbook</Link></li>
              <li><Link href="/faq">FAQ &amp; Knowledge Base</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Trust &amp; E-E-A-T</h4>
            <ul>
              <li><Link href="/about">About Us &amp; Mission</Link></li>
              <li><Link href="/authors">Our AI &amp; Human Analysts</Link></li>
              <li><Link href="/editorial-policy">Editorial Policy</Link></li>
              <li><Link href="/methodology">5-Step Audit Framework</Link></li>
              <li><Link href="/contact">Editorial &amp; Security Desk</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal &amp; Compliance</h4>
            <ul>
              <li><Link href="/disclaimer">Financial &amp; Risk Disclaimer</Link></li>
              <li><Link href="/privacy">Privacy Policy (GDPR/CCPA)</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/sitemap.xml">XML Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Crypto Airdrop AI (cryptoairdropai.com). All rights reserved. Non-custodial research.</span>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/methodology" style={{ color: "var(--cyan)" }}>Audit Standard</Link>
            <Link href="/editorial-policy" style={{ color: "var(--emerald)" }}>Fact-Checked</Link>
            <Link href="/privacy" style={{ color: "var(--muted)" }}>Zero-Keys</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
