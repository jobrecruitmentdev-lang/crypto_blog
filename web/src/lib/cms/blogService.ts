import type { BlogPost } from '../types';
import { BLOG_POSTS, getBlogPostBySlug as getLocalPostBySlug } from '../data';

const API_BASE_URL = 'https://cryptoairdropai.com/api';

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/get_posts.php`, { next: { revalidate: 60 } });
    if (!res.ok) return BLOG_POSTS;
    
    const json = await res.json();
    if (!json.success || !json.data || !json.data.length) return BLOG_POSTS;

    return json.data.map((post: any) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      tldr: post.tldr || undefined,
      tag: post.category || "Crypto News",
      date: post.published_at ? post.published_at.substring(0, 10) : new Date().toISOString().substring(0, 10),
      updatedAt: post.updated_at ? post.updated_at.substring(0, 10) : undefined,
      read: post.read_time || "5 min",
      authorSlug: post.author_slug || "editorial-desk",
      body: post.body || "",
      coverImage: post.cover_image_url || undefined,
    }));
  } catch (error) {
    return BLOG_POSTS;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/get_post_by_slug.php?slug=${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return getLocalPostBySlug(slug);
    
    const json = await res.json();
    if (!json.success || !json.data) return getLocalPostBySlug(slug);

    const post = json.data;
    const localFallback = getLocalPostBySlug(slug);
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      tldr: post.tldr || localFallback?.tldr,
      keyTakeaways: post.key_takeaways ? JSON.parse(post.key_takeaways) : localFallback?.keyTakeaways,
      tag: post.category || localFallback?.tag || "Crypto",
      date: post.published_at ? post.published_at.substring(0, 10) : localFallback?.date || new Date().toISOString().substring(0, 10),
      updatedAt: post.updated_at ? post.updated_at.substring(0, 10) : localFallback?.updatedAt,
      read: post.read_time || localFallback?.read || "5 min",
      authorSlug: post.author_slug || localFallback?.authorSlug || "editorial-desk",
      body: post.body || localFallback?.body || "",
      faqs: post.faqs ? JSON.parse(post.faqs) : localFallback?.faqs,
      coverImage: post.cover_image_url || localFallback?.coverImage,
    };
  } catch (error) {
    return getLocalPostBySlug(slug);
  }
}
