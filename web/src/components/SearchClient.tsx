"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import AirdropCard from "./AirdropCard";
import type { Airdrop } from "@/lib/types";

export default function SearchClient({
  airdrops,
  initialQuery = "",
}: {
  airdrops: Airdrop[];
  initialQuery?: string;
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery || searchParams.get('q') || "");

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return airdrops;
    return airdrops.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.chain.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [airdrops, query]);

  return (
    <>
      <p style={{ color: "var(--muted)", marginBottom: 16 }}>
        {query.trim() ? `${results.length} result(s) for "${query.trim()}"` : "Find a project by name, blockchain, or tag"}
      </p>
      <div className="search-box" style={{ maxWidth: 480, marginBottom: 24 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search airdrops..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {results.length ? (
        <div className="card-grid">
          {results.map((a) => (
            <AirdropCard key={a.slug} airdrop={a} />
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--muted)", marginTop: 20 }}>No airdrops matched your search.</p>
      )}
    </>
  );
}
