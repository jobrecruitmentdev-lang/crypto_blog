import { getSortedPostsData, getPostData } from '../markdown';
import type { BlogPost } from '../types';

export async function getAllPosts(): Promise<BlogPost[]> {
  const allPosts = getSortedPostsData();
  
  return allPosts.map(post => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    tag: "Blog",
    date: post.date,
    read: "5 min", // Default mock, could be dynamic
    body: "", // getAllPosts usually doesn't need full body in index, but mapping matches type
  }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const post = await getPostData(slug);
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt || "",
      tag: "Blog",
      date: post.date,
      read: "5 min", // Default mock
      body: post.contentHtml,
    };
  } catch (error) {
    return undefined; // File not found or parse error
  }
}
