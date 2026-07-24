import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetail from '@/components/ProductDetail';
import { getProductBySku } from '@/lib/products';
import { firstImage } from '@/lib/placeholder';
import { DEFAULT_DESCRIPTION } from '@/lib/seo';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/structured-data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }>;
}): Promise<Metadata> {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) {
    return { title: 'Product Not Found', description: DEFAULT_DESCRIPTION };
  }

  const title = `${product.name} — ${product.fabric} ${product.category === 'saree' ? 'Saree' : ''} Online`.replace(/\s+/g, ' ').trim();
  const description = `${product.description} Shop ${product.name} online at KSarees — ${product.fabric} ${product.category}, shipped to Australia, NZ, Fiji, UK, USA & the Caribbean.`;
  const image = firstImage(product.images);

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.sku}` },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/products/${product.sku}`,
      images: [{ url: image, width: 800, height: 1067, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  const product = await getProductBySku(sku);
  if (!product) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(product)) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
