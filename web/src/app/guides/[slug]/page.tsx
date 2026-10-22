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
  const siteUrl = "https://cryptoairdropai.com";
  const pageUrl = `${siteUrl}/guides/${slug}/`;

  if (!article) {
    const fallback = getGuideBySlug(slug);
    if (fallback) {
      const fallbackImg = `${siteUrl}/images/generated/${slug}-featured-v4.jpg`;
      return {
        title: `${fallback.title} — Step-by-Step Tactical Farming Guide`,
        description: fallback.desc,
        alternates: { canonical: pageUrl },
        openGraph: {
          title: `${fallback.title} | Crypto Airdrop AI Playbook`,
          description: fallback.desc,
          type: "article",
          url: pageUrl,
          siteName: "Crypto Airdrop AI",
          images: [{ url: fallbackImg, width: 1200, height: 630, alt: fallback.title }]
        },
        twitter: {
          card: "summary_large_image",
          title: fallback.title,
          description: fallback.desc,
          images: [fallbackImg]
        }
      };
    }
    return {};
  }

  const rawImg = article.featuredImage || `/images/generated/${slug}-featured-v4.jpg`;
  const ogImg = rawImg.startsWith("http") ? rawImg : `${siteUrl}${rawImg}`;
  const pageTitle = `${article.title} — Step-by-Step Tactical Farming Guide (2026)`;
  const pageDesc = article.excerpt || "Step-by-step on-chain playbook covering non-custodial wallet security, bridge routing, snapshot qualification, and anti-sybil defenses.";

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: { canonical: pageUrl },
    keywords: [
      article.title,
      "airdrop farming guide",
      "crypto tutorial",
      "sybil defense",
      "testnet playbook",
      "wallet isolation manual",
      article.tag || "Web3 Security"
    ],
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      type: "article",
      url: pageUrl,
      siteName: "Crypto Airdrop AI",
      publishedTime: article.date,
      modifiedTime: article.updatedAt || article.date,
      authors: [`${siteUrl}/authors/${article.authorSlug || 'editorial-desk'}/`],
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDesc,
      creator: "@cryptoairdropai",
      site: "@cryptoairdropai",
      images: [ogImg]
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
