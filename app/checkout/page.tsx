'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { useCurrency } from '@/components/CurrencyProvider';
import { SHIPPING_REGIONS, getShippingRate } from '@/lib/shipping';

function OrderConfirmation({ simulated }: { simulated: boolean }) {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="container-px py-20 text-center max-w-lg mx-auto">
      <div className="text-5xl mb-4">✦</div>
      <h1 className="font-serif text-3xl mb-3">Order Confirmed!</h1>
      <p className="text-gray-600 mb-2">
        Thank you for shopping with KSarees. A confirmation has been sent to your
        email.
      </p>
      {simulated && (
        <p className="text-xs text-gray-400 mb-6">
          (Demo mode — no real payment was processed. Add Stripe keys to enable
          live checkout.)
        </p>
      )}
      <Link href="/products" className="btn-gold mt-4">
        Continue Shopping
      </Link>
    </div>
  );
}

function CheckoutForm() {
  const { items, subtotal } = useCart();
  const { currency, rate, format } = useCurrency();
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('AU');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shipping = getShippingRate(country); // AUD base
  const total = subtotal + shipping; // AUD base

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send AUD base amounts plus the EXACT currency + rate shown to the user.
        // The server charges using this locked rate so charge == displayed.
        body: JSON.stringify({ email, country, items, currency, rate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-px py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Nothing to Checkout</h1>
        <Link href="/products" className="btn-gold">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container-px py-10">
      <h1 className="font-serif text-4xl mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-10">
        {/* Form */}
        <form onSubmit={handlePay} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Shipping Region
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="input"
            >
              {SHIPPING_REGIONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.label} — {format(r.rate)}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Flat shipping rate applied based on your region.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-sm p-4 text-sm text-gray-600">
            <p className="font-medium text-charcoal mb-1">Payment</p>
            <p>
              You&apos;ll be securely redirected to Stripe to pay by card
              (Visa &amp; Mastercard). Card details are never stored on our
              servers.
            </p>
            <p className="mt-1.5 text-xs">
              You will be charged{' '}
              <span className="font-medium text-charcoal">{format(total)}</span>{' '}
              ({currency}) — exactly the amount shown, at the rate locked when
              you check out.
            </p>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={loading} className="btn-gold w-full">
            {loading ? 'Processing…' : `Pay ${format(total)}`}
          </button>
        </form>

        {/* Summary */}
        <aside className="bg-gray-50 border border-gray-100 rounded-sm p-6 h-fit">
          <h2 className="font-serif text-xl mb-4">Order Summary</h2>
          <ul className="space-y-3 mb-4">
            {items.map((i) => (
              <li key={i.sku} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {i.name} × {i.quantity}
                </span>
                <span>{format(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{format(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{format(shipping)}</span>
            </div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>{format(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CheckoutInner() {
  const params = useSearchParams();
  const status = params.get('status');
  if (status === 'success') {
    return <OrderConfirmation simulated={params.get('sim') === '1'} />;
  }
  return <CheckoutForm />;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container-px py-20">Loading…</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
