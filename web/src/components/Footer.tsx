import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="logo" href="/">
              <Image src="/logo-primary.svg" alt="CryptoDrop" width={160} height={32} />
            </Link>
            <p>
              Free crypto airdrop aggregator. We don&apos;t run the listed airdrops — always do
              your own research before connecting a wallet.
            </p>
            <div className="social-row">
              <div className="icon-btn">X</div>
              <div className="icon-btn">TG</div>
              <div className="icon-btn">DC</div>
            </div>
          </div>
          <div className="footer-col">
            <h4>Read</h4>
            <ul>
              <li><Link href="/blog">Latest News</Link></li>
              <li><Link href="/guides">Actionable Guides</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/search">Search</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/contact">Submit Airdrop</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/terms">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 CryptoDrop. Not financial advice.</span>
          <span>Built for research &amp; educational purposes.</span>
        </div>
      </div>
    </footer>
  );
}
