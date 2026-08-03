import type { Metadata } from "next";
import { Suspense } from "react";
import SearchClient from "@/components/SearchClient";
import { AIRDROPS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Search Airdrops",
  description: "Search crypto airdrops by project, blockchain, reward or difficulty.",
  robots: { index: false },
};

export default function SearchPage() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>Search Airdrops</h2>
          </div>
        </div>
        <Suspense fallback={<div>Loading search...</div>}>
          <SearchClient airdrops={AIRDROPS} />
        </Suspense>
      </div>
    </section>
  );
}
