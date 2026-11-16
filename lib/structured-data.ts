import { CatalogProduct } from './catalog';
import { SITE_NAME, SITE_URL, absoluteUrl, INSTAGRAM_URL, TIKTOK_PROFILE_URL } from './site';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/apple-touch-icon.png'),
    address: { '@type': 'PostalAddress', addressLocality: 'Brisbane', addressRegion: 'QLD', addressCountry: 'AU' },
    currenciesAccepted: 'AUD',
    sameAs: [INSTAGRAM_URL, TIKTOK_PROFILE_URL].filter(Boolean),
  };
}

export function productJsonLd(p: CatalogProduct, available: boolean) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.title,
    description: p.shortDescription,
    sku: p.sku,
    image: p.gallery.map((g) => absoluteUrl(g.src)),
    material: p.fabric,
    color: p.colour,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/sarees/${p.slug}`),
      priceCurrency: 'AUD',
      price: p.priceAud.toFixed(2),
      availability: available ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: SITE_NAME },
    },
  };
}

export function breadcrumbJsonLd(p: CatalogProduct) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Sarees', item: absoluteUrl('/sarees') },
      { '@type': 'ListItem', position: 3, name: p.title, item: absoluteUrl(`/sarees/${p.slug}`) },
    ],
  };
}

