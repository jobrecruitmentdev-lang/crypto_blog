import Link from "next/link";
import Ticker from "@/components/Ticker";
import FilterableGrid from "@/components/FilterableGrid";
import AirdropCard from "@/components/AirdropCard";
import CategoryGrid from "@/components/CategoryGrid";
import BlogGrid from "@/components/BlogGrid";
import FaqAccordion from "@/components/FaqAccordion";
import Newsletter from "@/components/Newsletter";
import { AIRDROPS, BLOG_POSTS, CATEGORIES, FAQS } from "@/lib/data";

export default function Home() {
  const latest = AIRDROPS.slice(0, 8);
  const hot = [...AIRDROPS].sort((a, b) => b.heat - a.heat).slice(0, 8);
  const confirmed = AIRDROPS.filter((a) => a.status.includes("Confirmed"));
  const featured = hot[0];

  return (
    <>
      <div className="announce">
        🚀 New: Monad mainnet is live —{" "}
        <Link href={`/projects/${featured.slug}`}>check the guide</Link>
      </div>

      <Ticker />

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>
              Discover the latest <span>crypto airdrops</span> before everyone else
            </h1>
            <p>
              We verify and track free token distributions across every major chain — daily.
              Follow simple guides, complete tasks, and claim what&apos;s yours.
            </p>
            <div className="hero-actions">
              <Link href="/latest" className="btn btn-primary">
                Explore Airdrops
              </Link>
              <Link href="/faq" className="btn btn-outline">
                How It Works
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <b>1,240+</b>
                <span>Airdrops Tracked</span>
              </div>
              <div className="hero-stat">
                <b>85</b>
                <span>Confirmed Rewards</span>
              </div>
              <div className="hero-stat">
                <b>320K</b>
                <span>Monthly Readers</span>
              </div>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-top">
              <span className="badge hot">🔥 Trending</span>
              <span className="badge confirmed">Confirmed</span>
            </div>
            <div className="hero-card-proj">
              <div className="proj-logo">MO</div>
              <div>
                <b>Monad</b>
                <small>Layer 1 · Mainnet Live</small>
              </div>
            </div>
            <div className="hero-card-meta">
              <div className="meta-box">
                <span>Reward</span>
                <b>$500-$5000</b>
              </div>
              <div className="meta-box">
                <span>Difficulty</span>
                <b>Medium</b>
              </div>
              <div className="meta-box">
                <span>Time</span>
                <b>20 min</b>
              </div>
              <div className="meta-box">
                <span>Status</span>
                <b>Ongoing</b>
              </div>
            </div>
            <Link href="/projects/monad" className="btn btn-primary" style={{ width: "100%" }}>
              Join Now
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="latest">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Latest Airdrops</h2>
              <p>Newest projects added to our directory</p>
            </div>
            <Link href="/latest">View all →</Link>
          </div>
          <FilterableGrid airdrops={latest} />
        </div>
      </section>

      <section className="section" id="hot">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Hottest Airdrops</h2>
              <p>Ranked by community engagement</p>
            </div>
            <Link href="/hot">View all →</Link>
          </div>
          <div className="card-grid">
            {hot.map((a) => (
              <AirdropCard key={a.slug} airdrop={a} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="confirmed">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Confirmed Airdrops</h2>
              <p>Projects with an officially confirmed token</p>
            </div>
            <Link href="/confirmed">View all →</Link>
          </div>
          <div className="card-grid">
            {confirmed.map((a) => (
              <AirdropCard key={a.slug} airdrop={a} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="categories">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Browse by Category</h2>
              <p>Find airdrops across every ecosystem</p>
            </div>
            <Link href="/categories">View all →</Link>
          </div>
          <CategoryGrid categories={CATEGORIES} />
        </div>
      </section>

      <section className="section" id="blog">
        <div className="wrap">
          <div className="section-head">
            <div>
              <h2>Latest from the Blog</h2>
              <p>Guides, news and strategy</p>
            </div>
            <Link href="/blog">View all →</Link>
          </div>
          <BlogGrid posts={BLOG_POSTS} />
        </div>
      </section>

      <section className="edu section">
        <div className="wrap edu-content">
          <h2>Understanding Crypto Airdrops</h2>
          <p>
            Cryptocurrency airdrops are a token distribution strategy where blockchain projects
            share free tokens with community members to build awareness, decentralize ownership,
            and reward genuine participation.
          </p>
          <h3>Why Projects Give Away Free Tokens</h3>
          <ul>
            <li>Create mass awareness with minimal marketing cost</li>
            <li>Build a dedicated community of holders</li>
            <li>Reward early adopters and long-term believers</li>
            <li>Establish wide, decentralized token distribution</li>
          </ul>
          <h3>Common Types</h3>
          <ul>
            <li><b>Holder airdrops</b> — automatic rewards for existing token holders</li>
            <li><b>Testnet airdrops</b> — rewards for participating in protocol testing</li>
            <li><b>Retroactive airdrops</b> — rewards for historical, verifiable usage</li>
            <li><b>Layer 2 airdrops</b> — rewards for bridging and using rollup ecosystems</li>
          </ul>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <div className="section-head">
            <div>
              <h2>Frequently Asked Questions</h2>
            </div>
          </div>
          <FaqAccordion faqs={FAQS} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Newsletter />
        </div>
      </section>
    </>
  );
}
