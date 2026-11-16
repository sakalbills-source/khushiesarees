import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { recordSale } from '@/lib/inventory';

export const dynamic = 'force-dynamic';

/**
 * Stripe webhook. Point a Stripe (test mode) webhook endpoint at
 *   <site>/api/stripe/webhook
 * for: checkout.session.completed, checkout.session.async_payment_succeeded
 * and put its signing secret in STRIPE_WEBHOOK_SECRET.
 *
 * Stock is taken off only when the session is PAID.
 */
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 503 });
  }

  const payload = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: 'Bad signature.' }, { status: 400 });
  }

  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === 'paid') {
      try {
        const result = await recordSale(session);
        if (result.oversold.length) {
          console.error(`OVERSOLD ${result.oversold.join(',')} on ${session.id}: contact the customer`);
        }
        return NextResponse.json({ received: true, ...result });
      } catch (err) {
        console.error('recordSale failed:', err);
        // 500 makes Stripe retry; recordSale is idempotent per session.
        return NextResponse.json({ error: 'Could not record sale.' }, { status: 500 });
      }
    }
  }
  return NextResponse.json({ received: true });
}
