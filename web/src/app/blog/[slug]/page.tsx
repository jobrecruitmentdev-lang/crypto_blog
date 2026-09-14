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
  return {
    title: `${post.title} — Crypto Airdrop AI`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://cryptoairdropai.com/blog/${slug}/`,
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: [`https://cryptoairdropai.com/authors/${post.authorSlug}/`],
      images: post.featuredImage || post.coverImage ? [
        { url: post.featuredImage || post.coverImage! }
      ] : undefined
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
