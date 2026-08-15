import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AIRDROPS, getAirdropBySlug, getRelatedAirdrops } from "@/lib/data";

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export function generateStaticParams() {
  return AIRDROPS.map((a) => ({ slug: a.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const airdrop = getAirdropBySlug(slug);
  if (!airdrop) return {};
  return {
    title: `${airdrop.name} Airdrop Guide`,
    description: `${airdrop.name} airdrop guide: reward, difficulty, steps and FAQ.`,
    alternates: { canonical: `/projects/${slug}` },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const airdrop = getAirdropBySlug(slug);
  if (!airdrop) notFound();

  const related = getRelatedAirdrops(airdrop);
  const steps = [
    `Go to the official ${airdrop.name} website and open the app.`,
    `Connect your wallet (MetaMask, Phantom, or the chain-appropriate wallet).`,
    `Complete the core action: ${airdrop.desc.toLowerCase()}`,
    `Engage consistently — daily or weekly — rather than in a single burst.`,
    `Share your referral link if available; referral activity often counts toward future rewards.`,
  ];

  return (
    <div className="wrap section">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <Link href="/blog">Reviews</Link> / {airdrop.name}
      </div>

      <div className="detail-grid">
        <div>
          <div className="detail-card">
            <div className="detail-head">
              <div className="proj-logo">{initials(airdrop.name)}</div>
              <div>
                <h1>{airdrop.name}</h1>
                <div className="card-badges">
                  {airdrop.status.map((s) => (
                    <span key={s} className={`badge ${s.toLowerCase() === "confirmed" ? "confirmed" : ""}`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>{airdrop.desc}</p>
          </div>

          <div className="detail-card">
            <h3 style={{ marginBottom: 10 }}>Airdrop Details</h3>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              {airdrop.name} has {airdrop.status.includes("Confirmed") ? "a confirmed token" : "not confirmed a token yet"}.
              This guide covers the highest-signal actions based on public activity: {airdrop.tags.join(", ")}.
              Consistent participation over time typically outperforms a single burst of activity for any
              retroactive snapshot.
            </p>
          </div>

          <div className="detail-card">
            <h3 style={{ marginBottom: 6 }}>How to Farm the Potential Airdrop</h3>
            <div className="steps">
              {steps.map((s, i) => (
                <div className="step" key={i}>
                  <div className="step-num">{i + 1}</div>
                  <div>{s}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-card">
            <h3 style={{ marginBottom: 10 }}>FAQ</h3>
            <div className="faq-item open">
              <div className="faq-q" style={{ cursor: "default" }}>
                Does {airdrop.name} have a token?
              </div>
              <div className="faq-a" style={{ maxHeight: 100 }}>
                <p>
                  {airdrop.status.includes("Confirmed")
                    ? `Yes, ${airdrop.name} has confirmed rewards for eligible users.`
                    : `Not yet confirmed — this is a speculative farming opportunity.`}
                </p>
              </div>
            </div>
            <div className="faq-item open">
              <div className="faq-q" style={{ cursor: "default" }}>
                How much can I earn?
              </div>
              <div className="faq-a" style={{ maxHeight: 100 }}>
                <p>
                  Estimates range around {airdrop.reward}, based on comparable platform reward
                  structures. Actual results vary.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="sidebar-card">
            <button className="btn btn-primary" style={{ width: "100%", marginBottom: 10 }}>
              Join Now
            </button>
            <button className="btn btn-outline" style={{ width: "100%" }}>
              Notify Me
            </button>
          </div>
          <div className="sidebar-card">
            <div className="info-row">
              <span>Difficulty</span>
              <b>{airdrop.difficulty}</b>
            </div>
            <div className="info-row">
              <span>Reward</span>
              <b>{airdrop.reward}</b>
            </div>
            <div className="info-row">
              <span>Time Required</span>
              <b>{airdrop.time}</b>
            </div>
            <div className="info-row">
              <span>Blockchain</span>
              <b>{airdrop.chain}</b>
            </div>
            <div className="info-row">
              <span>Status</span>
              <b>{airdrop.status.join(" / ")}</b>
            </div>
          </div>
          <div className="sidebar-card">
            <h4 style={{ marginBottom: 10, fontSize: 13 }}>More Airdrops to Farm</h4>
            {related.map((r) => (
              <div className="info-row" key={r.slug}>
                <Link href={`/projects/${r.slug}`}>
                  <b>{r.name}</b>
                </Link>
                <span>{r.chain}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
