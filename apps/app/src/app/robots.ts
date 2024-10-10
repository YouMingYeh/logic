import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/pricing', '/terms', '/privacy'],
    },
    sitemap: 'https://logic.adastra.tw/sitemap.xml',
  };
}
