import type { BlogPost, Article } from '../types';
import { BLOG_POSTS, getBlogPostBySlug as getLocalPostBySlug } from '../data';
import { getArticles, getArticleBySlug } from '../contentStore';

const API_BASE_URL = 'https://cryptoairdropai.com/api';

function formatArticleToBlogPost(art: Article): BlogPost {
  return {
    slug: art.slug,
    title: art.title,
    excerpt: art.excerpt,
    tldr: art.tldr,
    keyTakeaways: art.keyTakeaways,
    tag: art.tag,
    date: art.date,
    updatedAt: art.updatedAt,
    read: art.read,
    authorSlug: art.authorSlug,
    body: art.body,
    faqs: art.faqs,
    coverImage: art.featuredImage,
    featuredImage: art.featuredImage,
    middleImage: art.middleImage,
    preFaqImage: art.preFaqImage,
    seo: art.seo
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  // 1. Fetch directly from Hostinger MySQL Production API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${API_BASE_URL}/articles.php?type=intelligence`, {
      signal: controller.signal,
      next: { revalidate: 60 }
    } as RequestInit);
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.articles) && json.articles.length > 0) {
        return json.articles.map(formatArticleToBlogPost);
      }
    }
  } catch (err) {
    // API network fallback
  }

  // 2. Read from centralized contentStore
  try {
    const articles = await getArticles("intelligence");
    if (articles && articles.length > 0) {
      return articles.map(formatArticleToBlogPost);
    }
  } catch (e) {
    // fallback
  }

  // 3. Fallback to local verified static posts
  return BLOG_POSTS;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  // 1. Fetch single post from Hostinger MySQL API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(`${API_BASE_URL}/articles.php?slug=${encodeURIComponent(slug)}`, {
      signal: controller.signal,
      next: { revalidate: 60 }
    } as RequestInit);
    clearTimeout(timeoutId);

    if (res.ok) {
      const art = await res.json();
      if (art && art.slug) {
        return formatArticleToBlogPost(art);
      }
    }
  } catch (err) {
    // API network fallback
  }

  // 2. Fallback to contentStore
  try {
    const article = await getArticleBySlug(slug);
    if (article) {
      return formatArticleToBlogPost(article);
    }
  } catch (e) {
    // fallback
  }

  return getLocalPostBySlug(slug);
}
