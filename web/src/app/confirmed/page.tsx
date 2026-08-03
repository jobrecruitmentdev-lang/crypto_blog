import type { Metadata } from "next";
import Link from "next/link";
import AirdropCard from "@/components/AirdropCard";
import { AIRDROPS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Confirmed Crypto Airdrops",
  description: "Crypto airdrops with an officially confirmed token and reward structure.",
  alternates: { canonical: "/confirmed" },
};

export default function ConfirmedPage() {
  const confirmed = AIRDROPS.filter((a) => a.status.includes("Confirmed"));

  return (
    <section className="section">
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Confirmed Airdrops
        </div>
        <div className="section-head">
          <div>
            <h2>Confirmed Airdrops</h2>
            <p>Projects that have officially confirmed a token or reward</p>
          </div>
        </div>
        <div className="card-grid">
          {confirmed.map((a) => (
            <AirdropCard key={a.slug} airdrop={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
