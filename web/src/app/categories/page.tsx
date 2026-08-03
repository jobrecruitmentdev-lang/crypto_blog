import type { Metadata } from "next";
import Link from "next/link";
import CategoryGrid from "@/components/CategoryGrid";
import { CATEGORIES } from "@/lib/data";

export const metadata: Metadata = {
  title: "Airdrop Categories",
  description: "Browse crypto airdrops by blockchain and category: Ethereum, Solana, Layer 2, DeFi, Gaming, AI, NFT and more.",
  alternates: { canonical: "/categories" },
};

export default function CategoriesPage() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Categories
        </div>
        <div className="section-head">
          <div>
            <h2>Browse by Category</h2>
            <p>Find airdrops across every blockchain ecosystem</p>
          </div>
        </div>
        <CategoryGrid categories={CATEGORIES} />
      </div>
    </section>
  );
}
