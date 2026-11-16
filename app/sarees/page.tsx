import type { Metadata } from 'next';
import ShopGrid from '@/components/ShopGrid';
import { PRODUCTS } from '@/lib/catalog';
import { getStockSafe } from '@/lib/inventory';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Shop All Sarees',
  description:
    'Shop sarees from Khushie Sarees in Brisbane: modal silk Ajrakh with mirror work, embroidered georgette, soft art silk and Fendi fabric. Prices in AUD.',
  alternates: { canonical: '/sarees' },
};

export default async function SareesPage() {
  const stock = await getStockSafe();
  return (
    <div className="container-px pt-12">
      <header className="max-w-2xl">
        <p className="eyebrow">The collection</p>
        <h1 className="mt-2 text-4xl sm:text-5xl">Shop All Sarees</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Each saree in the boutique is chosen for its fabric, colour and finishing, and photographed so you can
          see the borders, motifs and tassels before you buy.
        </p>
      </header>
      <div className="mt-10">
        <ShopGrid products={PRODUCTS} initialStock={stock} />
      </div>
    </div>
  );
}
