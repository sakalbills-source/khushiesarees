import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Preview deployments are never indexed (Vercel also sends noindex on previews).
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/cart', '/order', '/api'] },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
