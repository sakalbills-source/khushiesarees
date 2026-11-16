import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { getProductBySku } from '@/lib/catalog';
import { getStock, HOLD_MINUTES } from '@/lib/inventory';
import { SITE_URL, absoluteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic';

/**
 * Creates a Stripe Checkout Session for the cart.
 * The client sends SKUs only; names and prices always come from the catalogue
 * on the server, and every SKU is checked against live stock first.
 */
export async function POST(req: NextRequest) {
  let body: { skus?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const skus = Array.isArray(body.skus)
    ? Array.from(new Set(body.skus.filter((s): s is string => typeof s === 'string')))
    : [];
  if (skus.length === 0 || skus.length > 20) {
    return NextResponse.json({ error: 'Your bag is empty.' }, { status: 400 });
  }
  const products = skus.map((s) => getProductBySku(s));
  if (products.some((p) => !p)) {
    return NextResponse.json({ error: 'One of these sarees is no longer listed.' }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: 'Checkout is not connected yet. Please try again soon.', code: 'checkout_not_configured' },
      { status: 503 },
    );
  }

  // --- Oversell guard: every saree must still be available -----------------
  let stock;
  try {
    stock = await getStock();
  } catch (err) {
    console.error('Stock check failed:', err);
    return NextResponse.json({ error: 'We could not check stock just now. Please try again.' }, { status: 503 });
  }
  const unavailable = skus.filter((s) => (stock[s]?.available ?? 0) < 1);
  if (unavailable.length) {
    return NextResponse.json(
      {
        error: 'Sorry, a saree in your bag has just sold out or is being checked out by another shopper.',
        code: 'sold_out',
        unavailable,
      },
      { status: 409 },
    );
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ? SITE_URL : req.nextUrl.origin;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'aud',
      payment_method_types: ['card'],
      line_items: products.map((p) => ({
        quantity: 1,
        price_data: {
          currency: 'aud',
          unit_amount: Math.round(p!.priceAud * 100),
          product_data: {
            name: p!.title,
            description: `${p!.sku} · ${p!.fabric}`,
            images: [absoluteUrl(p!.gallery[0].src)],
            metadata: { sku: p!.sku },
          },
        },
      })),
      // Shipping rates are not approved yet, so none are charged here.
      // TODO(owner): add shipping_options once rates and zones are approved.
      shipping_address_collection: { allowed_countries: ['AU'] },
      phone_number_collection: { enabled: true },
      billing_address_collection: 'auto',
      expires_at: Math.floor(Date.now() / 1000) + HOLD_MINUTES * 60,
      metadata: { ks_skus: skus.join(',') },
      payment_intent_data: { metadata: { ks_skus: skus.join(',') } },
      success_url: `${origin}/order/confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?checkout=cancelled`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 500 });
  }
}
