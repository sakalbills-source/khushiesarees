import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductDetail from '@/components/ProductDetail';
import { getProductBySku } from '@/lib/products';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sku: string }>;
}): Promise<Metadata> {
  const { sku } = await params;
  const product = await getProductBySku(sku);
  return {
    title: product ? `${product.name} — KSarees` : 'Product — KSarees',
    description: product?.description,
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
  return <ProductDetail product={product} />;
}
