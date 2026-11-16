import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY ?? '';

/**
 * Live keys are refused everywhere except a production deployment, so a
 * preview or local build can only ever talk to Stripe TEST mode.
 */
function usableKey(): string | null {
  if (!secretKey) return null;
  const isLive = secretKey.startsWith('sk_live_') || secretKey.startsWith('rk_live_');
  if (isLive && process.env.VERCEL_ENV !== 'production') {
    console.error('Refusing a live Stripe key outside production.');
    return null;
  }
  return secretKey;
}

export function isStripeConfigured(): boolean {
  return usableKey() !== null;
}

export function isStripeTestMode(): boolean {
  return (usableKey() ?? '').includes('_test_');
}

let client: Stripe | null = null;

/** Server-side Stripe client. Returns null when not configured. */
export function getStripe(): Stripe | null {
  const key = usableKey();
  if (!key) return null;
  if (!client) client = new Stripe(key, { apiVersion: '2025-02-24.acacia' });
  return client;
}
