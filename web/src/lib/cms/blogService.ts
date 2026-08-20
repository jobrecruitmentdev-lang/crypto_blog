import type { BlogPost } from '../types';
import { BLOG_POSTS, getBlogPostBySlug as getLocalPostBySlug } from '../data';
import { supabase } from '../supabaseClient';

const API_BASE_URL = 'https://cryptoairdropai.com/api';

function formatPostRecord(post: any, localFallback?: BlogPost): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || localFallback?.excerpt || "",
    tldr: post.tldr || localFallback?.tldr || undefined,
    keyTakeaways: post.key_takeaways 
      ? (typeof post.key_takeaways === 'string' ? JSON.parse(post.key_takeaways) : post.key_takeaways)
      : localFallback?.keyTakeaways,
    tag: post.category || localFallback?.tag || "Crypto Airdrops",
    date: post.published_at ? post.published_at.substring(0, 10) : localFallback?.date || new Date().toISOString().substring(0, 10),
    updatedAt: post.updated_at ? post.updated_at.substring(0, 10) : localFallback?.updatedAt,
    read: post.read_time || localFallback?.read || "5 min",
    authorSlug: post.author_slug || localFallback?.authorSlug || "editorial-desk",
    body: post.body || localFallback?.body || "",
    faqs: post.faqs 
      ? (typeof post.faqs === 'string' ? JSON.parse(post.faqs) : post.faqs)
      : localFallback?.faqs,
    coverImage: post.cover_image_url || localFallback?.coverImage || undefined,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  // 1. Try Supabase first if available
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((p: any) => formatPostRecord(p));
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back:', e);
    }
  }

  // 2. Try PHP API endpoint
  try {
    const res = await fetch(`${API_BASE_URL}/get_posts.php`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data && json.data.length) {
        return json.data.map((p: any) => formatPostRecord(p));
      }
    }
  } catch (error) {
    // Fallback to local
  }

  // 3. Fallback to local verified static posts
  return BLOG_POSTS;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const localFallback = getLocalPostBySlug(slug);

  // 1. Try Supabase first if available
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (!error && data) {
        return formatPostRecord(data, localFallback);
      }
    } catch (e) {
      console.warn(`Supabase slug fetch failed for ${slug}:`, e);
    }
  }

  // 2. Try PHP API endpoint
  try {
    const res = await fetch(`${API_BASE_URL}/get_post_by_slug.php?slug=${slug}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return formatPostRecord(json.data, localFallback);
      }
    }
  } catch (error) {
    // Fallback to local
  }

  // 3. Fallback to local verified static post
  return localFallback;
}
