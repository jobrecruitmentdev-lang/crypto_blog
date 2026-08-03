import type { Metadata } from "next";
import Link from "next/link";
import BlogGrid from "@/components/BlogGrid";
import { getAllPosts } from "@/lib/cms/blogService";

export const metadata: Metadata = {
  title: "Blog",
  description: "Crypto news, airdrop guides, wallet tutorials and DeFi education from CryptoDrop.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <section className="section">
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Home</Link> / Blog
        </div>
        <div className="section-head">
          <div>
            <h2>Blog</h2>
            <p>Crypto news, guides and DeFi education</p>
          </div>
        </div>
        <BlogGrid posts={posts} />
      </div>
    </section>
  );
}
