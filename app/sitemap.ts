import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getProducts } from '@/lib/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // getProducts() returns an empty list when Supabase isn't configured (the
  // same "Coming soon" fallback the rest of the storefront uses — there is
  // no mock/seed catalogue in this repo), so the sitemap degrades to just
  // the static routes rather than failing the build.
  const { products } = await getProducts({ perPage: 10000 });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.sku}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
