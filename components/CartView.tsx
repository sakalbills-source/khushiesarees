'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useCart } from './CartProvider';
import { useStock } from './useStock';
import { formatAUD } from '@/lib/format';

export default function CartView() {
  const { products, subtotal, remove, hydrated } = useCart();
  const { stock, loaded } = useStock();
  const params = useSearchParams();
  const cancelled = params.get('checkout') === 'cancelled';
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [blocked, setBlocked] = useState<string[]>([]);

  const soldOut = products.filter((p) => loaded && stock && (stock[p.sku]?.available ?? 0) < 1).map((p) => p.sku);
  const unavailable = Array.from(new Set([...soldOut, ...blocked]));

  async function checkout() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skus: products.map((p) => p.sku) }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      if (data.code === 'sold_out' && Array.isArray(data.unavailable)) setBlocked(data.unavailable);
      setError(data.error || 'Could not start checkout.');
    } catch {
      setError('Could not reach checkout. Please check your connection and try again.');
    }
    setBusy(false);
  }

  if (!hydrated) return <div className="min-h-[40vh]" />;

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-ink-soft">Find a saree you love in the collection.</p>
        <Link href="/sarees" className="btn-primary mt-8">Shop Sarees</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
      <div>
        <h1 className="text-4xl">Your bag</h1>
        {cancelled && (
          <p className="mt-4 rounded-sm bg-cream-warm px-4 py-3 text-sm text-ink-soft" role="status">
            Checkout was cancelled. Your bag is saved below.
          </p>
        )}
        <ul className="mt-8 divide-y divide-zari/20 border-y border-zari/20">
          {products.map((p) => {
            const out = unavailable.includes(p.sku);
            return (
              <li key={p.sku} className="flex gap-4 py-5 sm:gap-6">
                <Link href={`/sarees/${p.slug}`} className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-sm bg-cream-warm sm:w-28">
                  <Image src={p.gallery[0].src} alt={p.gallery[0].alt} fill sizes="112px" className="object-contain" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <p className="eyebrow">{p.fabric}</p>
                  <Link href={`/sarees/${p.slug}`} className="mt-1 font-serif text-xl leading-snug hover:text-kumkum">
                    {p.title}
                  </Link>
                  <p className="mt-1 text-xs text-ink-mute">{p.sku} · Qty 1</p>
                  {out && (
                    <p className="mt-2 text-sm font-medium text-kumkum" role="alert">
                      Sold out. Please remove it to check out.
                    </p>
                  )}
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <button type="button" onClick={() => remove(p.sku)} className="min-h-[40px] text-sm text-ink-mute underline underline-offset-4 hover:text-kumkum">
                      Remove
                    </button>
                    <p className="text-lg">{formatAUD(p.priceAud)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <aside aria-labelledby="summary" className="h-fit rounded-sm bg-cream-warm p-6 lg:sticky lg:top-28">
        <h2 id="summary" className="text-2xl">Order summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd>{formatAUD(subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Shipping</dt>
            <dd className="text-right text-ink-mute">To be confirmed</dd>
          </div>
          <div className="flex justify-between border-t border-zari/25 pt-3 text-base">
            <dt>Total (AUD)</dt>
            <dd className="font-medium">{formatAUD(subtotal)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs leading-relaxed text-ink-mute">
          Placeholder: shipping rates are awaiting owner approval and are not charged in this preview.
        </p>
        <button
          type="button"
          onClick={checkout}
          disabled={busy || unavailable.length > 0}
          className="btn-primary mt-6 w-full text-base"
        >
          {busy ? 'Opening secure checkout…' : 'Checkout securely'}
        </button>
        {error && (
          <p className="mt-3 text-sm text-kumkum" role="alert">{error}</p>
        )}
        <p className="mt-4 text-center text-xs text-ink-mute">
          You will enter your card and delivery details on Stripe&apos;s secure page.
        </p>
        <Link href="/sarees" className="mt-4 block text-center text-sm link-underline">Continue shopping</Link>
      </aside>
    </div>
  );
}
