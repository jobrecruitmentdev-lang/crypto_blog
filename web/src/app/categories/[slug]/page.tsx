import type { Metadata } from "next";
import Link from "next/link";
import AirdropCard from "@/components/AirdropCard";
import { CATEGORIES, getAirdropsByCategory, getCategoryBySlug } from "@/lib/data";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const name = category?.name ?? slug;
  return {
    title: `${name} Airdrops`,
    description: `Browse the latest ${name} crypto airdrops, verified and updated regularly.`,
    alternates: { canonical: `/categories/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  const name = category?.name ?? slug;
  const airdrops = getAirdropsByCategory(slug);

  return (
    <section className="section">
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / <Link href="/categories">Categories</Link> / {name}
        </div>
        <div className="section-head">
          <div>
            <h2>{name} Airdrops</h2>
            <p>Every tracked airdrop tagged under {name}</p>
          </div>
        </div>
        {airdrops.length ? (
          <div className="card-grid">
            {airdrops.map((a) => (
              <AirdropCard key={a.slug} airdrop={a} />
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--muted)", marginTop: 20 }}>
            No airdrops found in this category yet — check back soon.
          </p>
        )}
      </div>
    </section>
  );
}
