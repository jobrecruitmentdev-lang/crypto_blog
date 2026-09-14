import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticles, getArticleBySlug } from "@/lib/contentStore";
import ArticleView from "@/components/ArticleView";

export async function generateStaticParams() {
  const articles = await getArticles("methodology");
  if (!articles || articles.length === 0) {
    return [{ slug: "5-stage-smart-contract-audit-telemetry-framework" }];
  }
  return articles.map((a) => ({ slug: a.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Crypto Airdrop AI Methodology`,
    description: article.excerpt,
    alternates: { canonical: `/methodology/${slug}/` },
    openGraph: {
      title: `${article.title} | Crypto Airdrop AI`,
      description: article.excerpt,
      type: "article",
      url: `https://cryptoairdropai.com/methodology/${slug}/`,
      images: article.featuredImage ? [{ url: article.featuredImage }] : undefined
    }
  };
}

export default async function MethodologyArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <ArticleView
      article={article}
      hubTitle="Methodology"
      hubPath="/methodology/"
    />
  );
}
