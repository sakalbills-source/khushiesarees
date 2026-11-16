import Link from 'next/link';
import type { Metadata } from 'next';
import ClearCart from '@/components/ClearCart';
import { getStripe, isStripeTestMode } from '@/lib/stripe';
import { getProductBySku } from '@/lib/catalog';
import { skusFromMetadata } from '@/lib/inventory';
import { formatAUD } from '@/lib/format';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Order confirmed', robots: { index: false, follow: false } };

export default async function OrderConfirmed({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const stripe = getStripe();
  let session = null;
  if (stripe && session_id && /^cs_[A-Za-z0-9_]+$/.test(session_id)) {
    try {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } catch {
      session = null;
    }
  }

  if (!session || session.payment_status !== 'paid') {
    return (
      <div className="container-px py-20 text-center">
        <h1 className="text-4xl">We could not find that order</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          If you have just paid, your confirmation may take a moment. Please check your email or contact us.
        </p>
        <Link href="/contact" className="btn-secondary mt-8">Contact us</Link>
      </div>
    );
  }

  const skus = skusFromMetadata(session.metadata);
  const items = skus.map((s) => getProductBySku(s)).filter(Boolean);
  const ship = (session as unknown as { collected_information?: { shipping_details?: { name?: string; address?: Record<string, string | null> } }; shipping_details?: { name?: string; address?: Record<string, string | null> } });
  const shipping = ship.collected_information?.shipping_details ?? ship.shipping_details;
  const ref = session.id.slice(-10).toUpperCase();

  return (
    <div className="container-px max-w-2xl py-16">
      <ClearCart skus={skus} />
      <p className="eyebrow">Thank you</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Your order is confirmed</h1>
      <p className="mt-4 text-ink-soft">
        Payment received. A copy of this confirmation is below
        {session.customer_details?.email ? <> for <strong className="text-ink">{session.customer_details.email}</strong></> : null}.
      </p>
      {isStripeTestMode() && (
        <p className="mt-3 rounded-sm bg-cream-warm px-4 py-2 text-xs text-ink-mute">Test mode: no real payment was taken.</p>
      )}

      <section aria-labelledby="receipt" className="mt-10 rounded-sm border border-zari/25 p-6">
        <h2 id="receipt" className="text-2xl">Order receipt</h2>
        <p className="mt-1 text-xs text-ink-mute">
          Order reference {ref} · {new Date(session.created * 1000).toLocaleString('en-AU', { timeZone: 'Australia/Brisbane' })}
        </p>
        <ul className="mt-5 divide-y divide-zari/15 text-sm">
          {items.map((p) => (
            <li key={p!.sku} className="flex justify-between gap-4 py-3">
              <span>{p!.title} <span className="text-ink-mute">({p!.sku})</span></span>
              <span>{formatAUD(p!.priceAud)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between border-t border-zari/25 pt-3">
          <span>Total paid</span>
          <span className="font-medium">{formatAUD((session.amount_total ?? 0) / 100)} AUD</span>
        </div>
        {shipping?.address && (
          <div className="mt-6 text-sm">
            <p className="text-ink-mute">Delivering to</p>
            <p className="mt-1">
              {shipping.name}<br />
              {[shipping.address.line1, shipping.address.line2].filter(Boolean).join(', ')}<br />
              {[shipping.address.city, shipping.address.state, shipping.address.postal_code].filter(Boolean).join(' ')}
            </p>
          </div>
        )}
      </section>

      <p className="mt-8 text-sm text-ink-soft">
        We will be in touch about delivery. Questions? <Link href="/contact" className="link-underline text-kumkum">Contact us</Link>.
      </p>
      <Link href="/sarees" className="btn-secondary mt-8">Continue shopping</Link>
    </div>
  );
}
