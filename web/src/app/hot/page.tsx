import type { Metadata } from "next";
import Link from "next/link";
import AirdropCard from "@/components/AirdropCard";
import { AIRDROPS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Hot Crypto Airdrops",
  description: "The hottest crypto airdrops right now, ranked by community engagement and momentum.",
  alternates: { canonical: "/hot" },
};

export default function HotPage() {
  const hot = [...AIRDROPS].sort((a, b) => b.heat - a.heat);

  return (
    <section className="section">
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Hot Airdrops
        </div>
        <div className="section-head">
          <div>
            <h2>Hottest Airdrops</h2>
            <p>Ranked by community engagement, bookmarks and shares</p>
          </div>
        </div>
        <div className="card-grid">
          {hot.map((a) => (
            <AirdropCard key={a.slug} airdrop={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
