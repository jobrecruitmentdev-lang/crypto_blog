import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticles, getArticleBySlug } from "@/lib/contentStore";
import ArticleView from "@/components/ArticleView";

export async function generateStaticParams() {
  const articles = await getArticles("editorial");
  if (!articles || articles.length === 0) {
    return [{ slug: "editorial-integrity-charter-and-fact-checking-code" }];
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
    title: `${article.title} — Crypto Airdrop AI Editorial Policy`,
    description: article.excerpt,
    alternates: { canonical: `/editorial-policy/${slug}/` },
    openGraph: {
      title: `${article.title} | Crypto Airdrop AI`,
      description: article.excerpt,
      type: "article",
      url: `https://cryptoairdropai.com/editorial-policy/${slug}/`,
      images: article.featuredImage ? [{ url: article.featuredImage }] : undefined
    }
  };
}

export default async function EditorialArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <ArticleView
      article={article}
      hubTitle="Editorial Policy"
      hubPath="/editorial-policy/"
    />
  );
}
