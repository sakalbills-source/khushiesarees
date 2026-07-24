/**
 * Central SEO config. NEXT_PUBLIC_SITE_URL should be set to the production
 * domain in Vercel env vars; falls back to a placeholder during local/dev
 * builds so metadataBase and next-sitemap always have a valid absolute URL.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ksarees.com'
).replace(/\/$/, '');

export const SITE_NAME = 'KSarees';

export const DEFAULT_TITLE =
  'KSarees — Buy Sarees Online Australia, NZ, Fiji, UK & USA | Indian Ethnic Wear';

export const DEFAULT_DESCRIPTION =
  'Shop authentic Banarasi silk sarees, Kanjivaram sarees, lehengas, salwar suits, kurtis and mens ethnic wear online. KSarees ships Indian sarees to Australia, New Zealand, Fiji, the UK, USA, Europe and the Caribbean — perfect for weddings, festivals and everyday elegance.';

export const DEFAULT_KEYWORDS = [
  'buy sarees online Australia',
  'Indian sarees NZ',
  'Banarasi silk saree',
  'Kanjivaram saree',
  'sarees for Fijian weddings',
  'Indian ethnic wear UK',
  'Indian sarees USA',
  'saree shop Australia',
  'wedding sarees online',
  'silk sarees online',
  'lehenga online Australia',
  'salwar suits online',
];

// Reuse the existing hero photography as the default social-share image so we
// don't depend on a local asset that doesn't exist yet in this repo.
export const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&h=630&fit=crop&q=80';

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
