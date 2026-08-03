import Link from "next/link";
import type { Guide } from "@/lib/types";

export default function GuideGrid({ guides }: { guides: Guide[] }) {
  return (
    <div className="blog-grid">
      {guides.map((g) => (
        <Link className="blog-card" href={`/guides/${g.slug}`} key={g.slug}>
          <div className="blog-thumb" />
          <div className="blog-body">
            <span className="blog-tag">{g.level}</span>
            <h3>{g.title}</h3>
            <p>{g.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
