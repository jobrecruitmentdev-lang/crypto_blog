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

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "url": `https://cryptoairdropai.com/blog/${slug}`,
    "publisher": {
      "@type": "Organization",
      "name": "CryptoDrop",
      "logo": {
        "@type": "ImageObject",
        "url": "https://cryptoairdropai.com/logo-primary.svg"
      }
    },
    "author": {
      "@type": "Person",
      "name": "CryptoDrop Editorial Team",
      "url": "https://cryptoairdropai.com/about",
      "sameAs": ["https://twitter.com/cryptoairdropai"]
    }
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://cryptoairdropai.com/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://cryptoairdropai.com/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://cryptoairdropai.com/blog/${slug}` }
    ]
  };

  return (
    <section className="section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      
      <div className="wrap post-body" style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px" }}>
        <div className="breadcrumb" style={{ marginBottom: 24, fontSize: "0.9rem", color: "var(--muted)" }}>
          <Link href="/">Home</Link> / <Link href="/blog">Blog</Link> / {post.title}
        </div>
        
        <span className="blog-tag" style={{ background: "var(--primary)", color: "white", padding: "4px 12px", borderRadius: 16, fontSize: "0.8rem", fontWeight: 700, marginBottom: 16, display: "inline-block" }}>
          {post.tag}
        </span>
        
        <h1 style={{ fontSize: "2.8rem", lineHeight: 1.1, marginBottom: 24, fontWeight: 900, letterSpacing: "-0.03em" }}>
          {post.title}
        </h1>
        
        <div className="author-byline" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40, paddingBottom: 24, borderBottom: "1px solid var(--border)" }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
            🕵️
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>CryptoDrop Editorial Team</div>
            <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
              {post.date} · {post.read} read · <a href="https://twitter.com/cryptoairdropai" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)" }}>@cryptoairdropai</a>
            </div>
          </div>
        </div>

        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.body }} style={{ fontSize: "1.1rem", lineHeight: 1.7 }} />
      </div>
    </section>
  );
}
