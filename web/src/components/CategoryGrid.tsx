import Link from "next/link";
import type { Category } from "@/lib/types";

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="cat-grid">
      {categories.map((c) => (
        <Link className="cat-card" href={`/categories/${c.slug}`} key={c.slug}>
          <div className="ic">{c.icon}</div>
          <b>{c.name}</b>
          <span>{c.count} airdrops</span>
        </Link>
      ))}
    </div>
  );
}
