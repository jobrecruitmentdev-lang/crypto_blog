import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticles, getArticleBySlug } from "@/lib/contentStore";
import { GUIDES, getGuideBySlug } from "@/lib/data";
import ArticleView from "@/components/ArticleView";
import type { Article } from "@/lib/types";

export async function generateStaticParams() {
  const articles = await getArticles("guides");
  const slugs = new Set(articles.map((a) => a.slug));
  GUIDES.forEach((g) => slugs.add(g.slug));
  return Array.from(slugs).map((slug) => ({ slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  let article = await getArticleBySlug(slug);
  if (!article) {
    const fallback = getGuideBySlug(slug);
    if (fallback) {
      return {
        title: `${fallback.title} — Step-by-Step Guide`,
        description: fallback.desc,
        alternates: { canonical: `/guides/${slug}/` }
      };
    }
    return {};
  }
  return {
    title: `${article.title} — Step-by-Step Guide`,
    description: article.excerpt,
    alternates: { canonical: `/guides/${slug}/` },
    openGraph: {
      title: `${article.title} | Crypto Airdrop AI Guide`,
      description: article.excerpt,
      type: "article",
      url: `https://cryptoairdropai.com/guides/${slug}/`,
      images: article.featuredImage ? [{ url: article.featuredImage }] : undefined
    }
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  let article = await getArticleBySlug(slug);

  if (!article) {
    const fallback = getGuideBySlug(slug);
    if (!fallback) notFound();

    article = {
      slug: fallback.slug,
      pageType: "guides",
      tag: "Farming Playbook",
      title: fallback.title,
      excerpt: fallback.desc,
      tldr: fallback.desc,
      keyTakeaways: [
        "Follow rigorous wallet isolation hygiene.",
        "Perform non-linear transactions across independent protocols.",
        "Maintain periodic weekly activity rather than single-day burst farming."
      ],
      date: "2026-08-20",
      updatedAt: fallback.updatedAt || "2026-08-24",
      read: "7 min read",
      authorSlug: fallback.authorSlug || "security-sentinel-ai",
      body: fallback.body,
      featuredImage: `/images/generated/${fallback.slug}-featured-v4.jpg`,
      middleImage: `/images/generated/${fallback.slug}-middle-v2.jpg`,
      preFaqImage: `/images/generated/${fallback.slug}-pre_faq-v2.jpg`,
      faqs: [
        { question: "How does the protocol detect sybils?", answer: "Sybils are flagged by shared deposit addresses, sequential transaction timestamps, and matching gas balances." },
        { question: "What is the recommended testnet cadence?", answer: "Interact 1-2 times weekly across at least 3 distinct smart contracts over a 60-day window." }
      ]
    };
  }

  return (
    <ArticleView
      article={article}
      hubTitle="Guides"
      hubPath="/guides/"
    />
  );
}
