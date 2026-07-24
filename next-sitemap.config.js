const { createClient } = require('@supabase/supabase-js');

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ksarees.com').replace(/\/$/, '');

/** Fetch product SKUs from Supabase (when configured) so /products/[sku]
 * pages are included in the generated sitemap. Falls back to an empty list
 * when Supabase isn't configured, so `next-sitemap` never fails the build. */
async function getProductPaths() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return [];

  try {
    const supabase = createClient(url, anonKey);
    const { data, error } = await supabase.from('products').select('sku, created_at');
    if (error || !data) return [];

    return data.map((p) => ({
      loc: `/products/${p.sku}`,
      lastmod: p.created_at ? new Date(p.created_at).toISOString() : undefined,
      changefreq: 'weekly',
      priority: 0.8,
    }));
  } catch {
    return [];
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*', '/cart', '/checkout', '/api/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/cart', '/checkout', '/api'] },
    ],
  },
  changefreq: 'weekly',
  priority: 0.7,
  additionalPaths: async () => {
    const productPaths = await getProductPaths();
    return [
      { loc: '/products', changefreq: 'daily', priority: 0.9 },
      ...productPaths,
    ];
  },
};
