import type { Metadata } from "next";
import SearchClient from "@/components/SearchClient";
import { AIRDROPS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Search Airdrops",
  description: "Search crypto airdrops by project, blockchain, reward or difficulty.",
  robots: { index: false },
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <div>
            <h2>Search Airdrops</h2>
          </div>
        </div>
        <SearchClient airdrops={AIRDROPS} initialQuery={q ?? ""} />
      </div>
    </section>
  );
}
