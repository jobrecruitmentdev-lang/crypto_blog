import { MetadataRoute } from 'next'

export const dynamic = "force-static";
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/projects/', '/blog/', '/guides/'],
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'Google-Extended', 'Googlebot', 'PerplexityBot', 'Perplexity-User', 'Meta-ExternalAgent', 'Applebot-Extended', 'Amazonbot', 'CCBot'],
        allow: ['/'],
      }
    ],
    sitemap: 'https://cryptoairdropai.com/sitemap.xml',
  }
}
