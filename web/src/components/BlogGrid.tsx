import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { getAuthorBySlug } from "@/lib/data";

export default function BlogGrid({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="blog-grid">
      {posts.map((p) => {
        const author = getAuthorBySlug(p.authorSlug);
        return (
          <Link className="blog-card" href={`/blog/${p.slug}`} key={p.slug}>
            <div className="blog-thumb" />
            <div className="blog-body">
              <span className="blog-tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
              <div className="blog-meta">
                <span>By {author?.name || "Editorial Desk"}</span>
                <span>{p.read} read</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
