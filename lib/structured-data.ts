import { Product } from './types';
import { firstImage } from './placeholder';
import { SITE_NAME, SITE_URL, absoluteUrl } from './seo';

/** Organization schema for the homepage — brand identity for search engines. */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
    description:
      'KSarees is an online retailer of authentic Indian ethnic wear — sarees, lehengas, salwar suits and kurtis — shipping to Australia, New Zealand, Fiji, the UK, USA, Europe and the Caribbean.',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: ['AU', 'NZ', 'FJ', 'GB', 'US', 'EU', 'CARIB'],
    },
  };
}

/** WebSite schema (with search action) for the homepage. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** Product schema for a product detail page. */
export function productJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.images && product.images.length > 0 ? product.images : [firstImage(product.images)],
    category: product.category,
    material: product.fabric,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/products/${product.sku}`),
      priceCurrency: 'AUD',
      price: product.price.toFixed(2),
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

/** BreadcrumbList schema for a product detail page. */
export function breadcrumbJsonLd(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: absoluteUrl('/products') },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: absoluteUrl(`/products/${product.sku}`),
      },
    ],
  };
}
