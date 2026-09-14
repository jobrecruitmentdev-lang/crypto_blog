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
  const targetPostId = process.env.TARGET_POST_ID;
  const targetReleaseId = process.env.TARGET_RELEASE_ID || process.env.RELEASE_ID;

  // 1. Try Supabase with Release Isolation
  if (supabase) {
    try {
      let query = supabase
        .from('posts')
        .select('*');

      // Scoped Build: If building for a specific release, allow published + target staged post
      if (targetReleaseId && targetPostId) {
        query = query.or(`status.eq.published,and(status.eq.staged,id.eq.${targetPostId})`);
      } else {
        // Global Rebuild: ONLY build verified published posts
        query = query.eq('status', 'published');
      }

      const { data, error } = await query.order('published_at', { ascending: false, nullsFirst: false });

      if (!error && data && data.length > 0) {
        return data.map((p: any) => formatPostRecord(p));
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back:', e);
    }
  }

  // 2. Try PHP API endpoint as fallback
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

  // 3. Read from centralized contentStore
  try {
    const { getArticles } = await import('../contentStore');
    const articles = await getArticles("intelligence");
    if (articles && articles.length > 0) {
      return articles.map((a) => ({
        ...a,
        coverImage: a.featuredImage
      }));
    }
  } catch (e) {
    // fallback
  }

  // 4. Fallback to local verified static posts
  return BLOG_POSTS;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const targetPostId = process.env.TARGET_POST_ID;
  const targetReleaseId = process.env.TARGET_RELEASE_ID || process.env.RELEASE_ID;

  if (supabase) {
    try {
      let query = supabase
        .from('posts')
        .select('*')
        .eq('slug', slug);

      if (targetReleaseId && targetPostId) {
        query = query.or(`status.eq.published,and(status.eq.staged,id.eq.${targetPostId})`);
      } else {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query.maybeSingle();

      if (!error && data) {
        return formatPostRecord(data);
      }
    } catch (e) {
      console.warn('Supabase getPostBySlug failed, falling back:', e);
    }
  }

  try {
    const { getArticleBySlug } = await import('../contentStore');
    const article = await getArticleBySlug(slug);
    if (article) {
      return {
        ...article,
        coverImage: article.featuredImage
      };
    }
  } catch (e) {
    // fallback
  }

  return getLocalPostBySlug(slug);
}
