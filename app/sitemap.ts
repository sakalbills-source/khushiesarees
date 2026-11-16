import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/catalog';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/sarees', '/about', '/faqs', '/contact', '/shipping', '/returns', '/privacy', '/terms'];
  return [
    ...pages.map((p) => ({ url: absoluteUrl(p), changeFrequency: 'weekly' as const, priority: p === '/' ? 1 : p === '/sarees' ? 0.9 : 0.4 })),
    ...PRODUCTS.map((p) => ({
      url: absoluteUrl(`/sarees/${p.slug}`),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      images: p.gallery.map((g) => absoluteUrl(g.src)),
    })),
  ];
}
