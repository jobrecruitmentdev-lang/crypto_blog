import type { Metadata } from "next";
import Link from "next/link";
import FilterableGrid from "@/components/FilterableGrid";
import { AIRDROPS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Latest Crypto Airdrops",
  description: "Browse the newest crypto airdrops added to our directory, updated daily across every major blockchain.",
  alternates: { canonical: "/latest" },
};

export default function LatestPage() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Latest Airdrops
        </div>
        <div className="section-head">
          <div>
            <h2>Latest Airdrops</h2>
            <p>Newest projects added to our directory, updated daily</p>
          </div>
        </div>
        <FilterableGrid airdrops={AIRDROPS} />
      </div>
    </section>
  );
}
