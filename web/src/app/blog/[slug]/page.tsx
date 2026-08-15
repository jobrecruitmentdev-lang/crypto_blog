import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/cms/blogService";

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
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "url": `https://cryptoairdropai.com/blog/${slug}`
  };

  return (
    <section className="section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="wrap post-body">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / {post.title}
        </div>
        <div className="post-thumb" />
        <span className="blog-tag">{post.tag}</span>
        <h1>{post.title}</h1>
        <div className="meta">
          {post.date} · {post.read} read
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.body }} />
      </div>
    </section>
  );
}
