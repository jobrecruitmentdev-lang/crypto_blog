import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDES, getGuideBySlug } from "@/lib/data";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.desc,
    alternates: { canonical: `/guides/${slug}` },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <section className="section">
      <div className="wrap post-body">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / <Link href="/guides">Guides</Link> / {guide.title}
        </div>
        <span className="blog-tag">{guide.level}</span>
        <h1>{guide.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: guide.body }} />
      </div>
    </section>
  );
}
