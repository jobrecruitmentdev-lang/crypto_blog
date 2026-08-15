import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/projects/', '/blog/', '/guides/'],
    },
    sitemap: 'https://cryptoairdropai.com/sitemap.xml',
  }
}
