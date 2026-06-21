import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

export function isStripeConfigured(): boolean {
  return Boolean(secretKey);
}

/** Server-side Stripe client. Returns null when not configured. */
export function getStripe(): Stripe | null {
  if (!secretKey) return null;
  return new Stripe(secretKey, { apiVersion: '2025-02-24.acacia' });
}
