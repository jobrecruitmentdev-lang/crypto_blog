import type { Metadata } from "next";
import Link from "next/link";
import GuideGrid from "@/components/GuideGrid";
import { GUIDES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Guides",
  description: "Step-by-step guides covering wallet setup, bridging, snapshot mechanics and sybil-safe farming strategy.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Guides
        </div>
        <div className="section-head">
          <div>
            <h2>Guides</h2>
            <p>Everything you need to farm airdrops safely and effectively</p>
          </div>
        </div>
        <GuideGrid guides={GUIDES} />
      </div>
    </section>
  );
}
