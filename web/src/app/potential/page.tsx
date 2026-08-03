import type { Metadata } from "next";
import Link from "next/link";
import AirdropCard from "@/components/AirdropCard";
import { AIRDROPS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Potential Crypto Airdrops",
  description: "Speculative crypto airdrops without a confirmed token yet — projects worth farming for a possible future reward.",
  alternates: { canonical: "/potential" },
};

export default function PotentialPage() {
  const potential = AIRDROPS.filter((a) => !a.status.includes("Confirmed"));

  return (
    <section className="section">
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Potential Airdrops
        </div>
        <div className="section-head">
          <div>
            <h2>Potential Airdrops</h2>
            <p>No confirmed token yet, but strong signals for a future reward</p>
          </div>
        </div>
        <div className="card-grid">
          {potential.map((a) => (
            <AirdropCard key={a.slug} airdrop={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
