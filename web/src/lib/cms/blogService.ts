import type { BlogPost } from '../types';

const API_BASE_URL = 'http://cryptoairdropai.com/api';

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/get_posts.php`, { cache: 'force-cache' });
    if (!res.ok) return [];
    
    const json = await res.json();
    if (!json.success) return [];

    return json.data.map((post: any) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      tag: "Blog",
      date: post.published_at || new Date().toISOString(),
      read: "5 min",
      body: "",
      coverImage: post.cover_image_url || undefined,
    }));
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const res = await fetch(`${API_BASE_URL}/get_post_by_slug.php?slug=${slug}`, { cache: 'force-cache' });
    if (!res.ok) return undefined;
    
    const json = await res.json();
    if (!json.success) return undefined;

    const post = json.data;
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      tag: "Blog",
      date: post.published_at || new Date().toISOString(),
      read: "5 min",
      body: post.body || "",
      coverImage: post.cover_image_url || undefined,
    };
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return undefined;
  }
}
