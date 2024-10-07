import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/home', '/pricing', '/terms', '/privacy'],
    },
    sitemap: 'https://logic.co/sitemap.xml',
  };
}
