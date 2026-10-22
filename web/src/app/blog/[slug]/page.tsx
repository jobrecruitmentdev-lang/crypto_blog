import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/cms/blogService";
import ArticleView from "@/components/ArticleView";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  if (!posts || posts.length === 0) {
    return [{ slug: 'coming-soon' }];
  }
  return posts.map((p) => ({ slug: p.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  
  const siteUrl = "https://cryptoairdropai.com";
  const pageUrl = `${siteUrl}/blog/${slug}/`;
  const rawImg = post.featuredImage || post.coverImage || `/images/generated/${slug}-featured.jpg`;
  const ogImg = rawImg.startsWith("http") ? rawImg : `${siteUrl}${rawImg}`;
  const pageTitle = `${post.title} — Crypto Airdrop Market Intelligence`;
  const pageDesc = post.excerpt || "Institutional Web3 research, on-chain telemetry, and retroactive airdrop farming analysis.";

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: { canonical: pageUrl },
    keywords: [
      post.title,
      "crypto market intelligence",
      "on-chain research",
      "tokenomics breakdown",
      "airdrop analysis",
      "crypto research 2026",
      post.tag || "Web3 Alpha"
    ],
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      type: "article",
      url: pageUrl,
      siteName: "Crypto Airdrop AI",
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: [`${siteUrl}/authors/${post.authorSlug || 'editorial-desk'}/`],
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: post.title,
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <ArticleView
      article={post}
      hubTitle="Intelligence"
      hubPath="/blog/"
    />
  );
}
