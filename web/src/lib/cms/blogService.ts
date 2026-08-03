import { fetchFromStrapi, STRAPI_URL } from "./strapiClient";
import type { BlogPost } from "../types";

function mapStrapiPostToBlogPost(strapiData: any): BlogPost {
  // Handle Blocks rich text structure to HTML or plain text string
  let bodyHtml = "";
  if (Array.isArray(strapiData.body)) {
    // Strapi Blocks rich text renderer
    bodyHtml = strapiData.body.map((block: any) => {
      if (block.type === 'paragraph') {
        const text = block.children?.map((c: any) => c.text).join('') || '';
        return `<p>${text}</p>`;
      }
      return '';
    }).join('');
  } else if (typeof strapiData.body === 'string') {
    bodyHtml = strapiData.body;
  }

  return {
    slug: strapiData.slug,
    title: strapiData.title,
    excerpt: strapiData.excerpt || "",
    tag: strapiData.tag || "Blog",
    date: new Date(strapiData.publishedAt || strapiData.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }),
    read: "5 min", // Mocked read time for now
    body: bodyHtml,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const data = await fetchFromStrapi("/blog-posts?populate=*&sort=publishedAt:desc");
  if (!data || !data.data) {
    return [];
  }
  return data.data.map((item: any) => mapStrapiPostToBlogPost(item));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const data = await fetchFromStrapi(`/blog-posts?filters[slug][$eq]=${slug}&populate=*`);
  if (!data || !data.data || data.data.length === 0) {
    return undefined;
  }
  return mapStrapiPostToBlogPost(data.data[0]);
}
