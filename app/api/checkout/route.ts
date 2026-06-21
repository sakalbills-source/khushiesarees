import { NextRequest, NextResponse } from 'next/server';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getShippingRate, getRegion } from '@/lib/shipping';
import { CartItem } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, country, items } = body as {
      email: string;
      country: string;
      items: CartItem[];
    };

    if (!email || !country || !items?.length) {
      return NextResponse.json(
        { error: 'Missing email, country, or items.' },
        { status: 400 },
      );
    }

    const region = getRegion(country);
    if (!region) {
      return NextResponse.json({ error: 'Invalid shipping region.' }, { status: 400 });
    }

    const shipping = getShippingRate(country);
    const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
    const total = subtotal + shipping;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin ?? 'http://localhost:3000';

    // Persist a pending order if Supabase is configured.
    let orderId: string | null = null;
    const admin = getSupabaseAdmin();
    if (admin) {
      const { data } = await admin
        .from('orders')
        .insert({
          user_email: email,
          shipping_country: country,
          items,
          total,
          status: 'pending',
        })
        .select('id')
        .maybeSingle();
      orderId = (data as { id?: string } | null)?.id ?? null;
    }

    // If Stripe is not configured, simulate a successful checkout (shell mode).
    if (!isStripeConfigured()) {
      return NextResponse.json({
        simulated: true,
        url: `${siteUrl}/checkout?status=success&sim=1`,
      });
    }

    const stripe = getStripe()!;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        ...items.map((i) => ({
          quantity: i.quantity,
          price_data: {
            currency: 'inr',
            unit_amount: Math.round(i.price * 100),
            product_data: {
              name: i.name,
              description: i.customization ? `Custom: ${i.customization}` : i.sku,
            },
          },
        })),
        {
          quantity: 1,
          price_data: {
            currency: 'inr',
            unit_amount: Math.round(shipping * 100),
            product_data: { name: `Shipping — ${region.label}` },
          },
        },
      ],
      success_url: `${siteUrl}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout?status=cancelled`,
      metadata: { orderId: orderId ?? '', country },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session.' },
      { status: 500 },
    );
  }
}
