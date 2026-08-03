import Link from "next/link";
import type { Airdrop } from "@/lib/types";

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export default function AirdropCard({ airdrop }: { airdrop: Airdrop }) {
  return (
    <div className="card">
      <div className="card-top">
        <div className="card-badges">
          {airdrop.status.map((s) => (
            <span key={s} className={`badge ${s.toLowerCase() === "confirmed" ? "confirmed" : ""}`}>
              {s}
            </span>
          ))}
        </div>
        <div className="heat">🔥 {airdrop.heat}°</div>
      </div>
      <div className="card-proj">
        <div className="proj-logo">{initials(airdrop.name)}</div>
        <div>
          <b>{airdrop.name}</b>
          <small>
            {airdrop.chain} · {airdrop.difficulty}
          </small>
        </div>
      </div>
      <div className="card-desc">{airdrop.desc}</div>
      <div className="card-meta">
        <div>
          Reward
          <br />
          <b>{airdrop.reward}</b>
        </div>
        <div>
          Time
          <br />
          <b>{airdrop.time}</b>
        </div>
      </div>
      <div className="card-footer">
        <Link href={`/projects/${airdrop.slug}`} className="btn btn-primary btn-sm">
          View Guide
        </Link>
        <div className="card-actions">
          <div className="icon-sm" title="Bookmark">☆</div>
          <div className="icon-sm" title="Share">↗</div>
        </div>
      </div>
    </div>
  );
}
