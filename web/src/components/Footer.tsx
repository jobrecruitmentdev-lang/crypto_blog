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
            <h4>Research &amp; Guides</h4>
            <ul>
              <li><Link href="/blog">Crypto Blog</Link></li>
              <li><Link href="/guides">Airdrop Guides</Link></li>
              <li><Link href="/latest">Latest Listings</Link></li>
              <li><Link href="/confirmed">Confirmed Tokens</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Trust &amp; E-E-A-T</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/authors">Our Analysts</Link></li>
              <li><Link href="/editorial-policy">Editorial Policy</Link></li>
              <li><Link href="/methodology">Methodology</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal &amp; Support</h4>
            <ul>
              <li><Link href="/disclaimer">Financial Disclaimer</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/contact">Contact &amp; Corrections</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Crypto Airdrop AI (cryptoairdropai.com). All rights reserved. Not financial advice.</span>
          <span>Built for decentralized research &amp; Web3 education.</span>
        </div>
      </div>
    </footer>
  );
}
