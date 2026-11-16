'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import { useStock } from './useStock';

export default function AddToCart({
  sku,
  initialAvailable,
  price,
}: {
  sku: string;
  initialAvailable: number;
  price?: string;
}) {
  const { has, add, hydrated } = useCart();
  const { stock } = useStock();
  const available = stock?.[sku]?.available ?? initialAvailable;
  const held = (stock?.[sku]?.held ?? 0) > 0;
  const inBag = hydrated && has(sku);

  if (available < 1 && !inBag) {
    return (
      <div>
        <button type="button" disabled className="btn-primary w-full bg-ink/70 hover:bg-ink/70" aria-disabled="true">
          Sold out
        </button>
        <p className="mt-3 text-sm text-ink-mute">
          {held
            ? 'Another shopper is checking out with this saree right now. If their payment does not go through it will be available again shortly.'
            : 'This saree has sold.'}{' '}
          <Link href="/sarees" className="link-underline text-kumkum">See the other sarees</Link>
        </p>
      </div>
    );
  }

  if (inBag) {
    return (
      <div className="space-y-3">
        <Link href="/cart" className="btn-primary w-full">
          In your bag · Go to checkout
        </Link>
        <p className="text-center text-sm text-ink-mute">This saree is in your bag.</p>
      </div>
    );
  }

  return (
    <>
      <button type="button" className="btn-primary w-full text-base" onClick={() => add(sku)}>
        Add to Bag
      </button>
      {/* Mobile: keep the buy button in reach while browsing photos and details */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-4 border-t border-zari/25 bg-cream/95 px-4 py-3 backdrop-blur lg:hidden">
        {price && <p className="text-lg text-ink">{price}</p>}
        <button type="button" className="btn-primary flex-1" onClick={() => add(sku)}>
          Add to Bag
        </button>
      </div>
    </>
  );
}
