"use client";

import { useMemo, useState } from "react";
import type { Airdrop } from "@/lib/types";
import AirdropCard from "./AirdropCard";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ongoing", label: "Ongoing" },
  { key: "confirmed", label: "Confirmed" },
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
];

export default function FilterableGrid({ airdrops }: { airdrops: Airdrop[] }) {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return airdrops;
    return airdrops.filter(
      (a) =>
        a.status.some((s) => s.toLowerCase() === active) ||
        a.difficulty.toLowerCase() === active
    );
  }, [airdrops, active]);

  return (
    <>
      <div className="filter-bar">
        {FILTERS.map((f) => (
          <div
            key={f.key}
            className={`chip${active === f.key ? " active" : ""}`}
            onClick={() => setActive(f.key)}
          >
            {f.label}
          </div>
        ))}
      </div>
      <div className="card-grid">
        {filtered.map((a) => (
          <AirdropCard key={a.slug} airdrop={a} />
        ))}
      </div>
    </>
  );
}
