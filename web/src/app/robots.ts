import { MetadataRoute } from 'next';

export const dynamic = "force-static";
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Google-Extended',
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'Claude-SearchBot',
          'PerplexityBot',
          'Perplexity-User',
          'Applebot',
          'Applebot-Extended'
        ],
        allow: '/',
        disallow: ['/api/'],
      }
    ],
    sitemap: 'https://cryptoairdropai.com/sitemap.xml',
    host: 'https://cryptoairdropai.com',
  };
}
