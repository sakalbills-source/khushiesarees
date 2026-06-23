import { NextRequest, NextResponse } from 'next/server';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getShippingRate, getRegion } from '@/lib/shipping';
import { CartItem } from '@/lib/types';
import {
  BASE_CURRENCY,
  CurrencyCode,
  getCurrency,
  isCurrencyCode,
} from '@/lib/currency';
import { getRates } from '@/lib/rates';

/** Convert a base-currency (AUD) amount to the charged currency's minor units. */
function toMinorUnits(aud: number, rate: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(aud * rate * factor);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, country, items, currency, rate } = body as {
      email: string;
      country: string;
      items: CartItem[];
      currency?: string;
      rate?: number;
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

    // --- Resolve the charged currency + the LOCKED rate shown to the user ----
    const chargeCurrency: CurrencyCode =
      currency && isCurrencyCode(currency) ? currency : BASE_CURRENCY;
    const meta = getCurrency(chargeCurrency);

    // The client sends the exact rate it displayed so charge == displayed.
    let lockedRate =
      chargeCurrency === BASE_CURRENCY
        ? 1
        : typeof rate === 'number' && isFinite(rate) && rate > 0
          ? rate
          : NaN;

    // Sanity-guard the client rate against live rates (anti-tamper). If it is
    // wildly off (or missing for a non-base currency), fall back to the live
    // server rate rather than trusting an implausible value.
    if (chargeCurrency !== BASE_CURRENCY) {
      const live = await getRates();
      const serverRate = live.rates[chargeCurrency];
      if (!isFinite(lockedRate)) {
        if (typeof serverRate === 'number' && serverRate > 0) lockedRate = serverRate;
        else
          return NextResponse.json(
            { error: 'Currency rate unavailable. Please try again.' },
            { status: 503 },
          );
      } else if (
        typeof serverRate === 'number' &&
        serverRate > 0 &&
        (lockedRate < serverRate * 0.5 || lockedRate > serverRate * 2)
      ) {
        // Implausible client rate — use the trusted server rate instead.
        lockedRate = serverRate;
      }
    }

    // --- Amounts: AUD base is the source of truth; charge in selected currency
    const subtotalAUD = items.reduce((n, i) => n + i.price * i.quantity, 0);
    const shippingAUD = getShippingRate(country);
    const totalAUD = subtotalAUD + shippingAUD;

    const chargedMinor =
      items.reduce(
        (n, i) => n + toMinorUnits(i.price, lockedRate, meta.decimals) * i.quantity,
        0,
      ) + toMinorUnits(shippingAUD, lockedRate, meta.decimals);
    const chargedAmount = chargedMinor / Math.pow(10, meta.decimals);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin ?? 'http://localhost:3000';

    // --- Persist a pending order (AUD base + locked FX details) -------------
    const fxFields = {
      currency: chargeCurrency,
      amount_charged: chargedAmount,
      fx_rate: lockedRate,
      aud_total: totalAUD,
    };
    let orderId: string | null = null;
    const admin = getSupabaseAdmin();
    if (admin) {
      const baseRecord = {
        user_email: email,
        shipping_country: country,
        items,
        total: totalAUD, // AUD remains the canonical stored total
        status: 'pending' as const,
      };
      // Try to store the FX columns; if the additive migration (orders_fx.sql)
      // hasn't been applied, fall back to the base record so checkout still works.
      let res = await admin
        .from('orders')
        .insert({ ...baseRecord, ...fxFields })
        .select('id')
        .maybeSingle();
      if (res.error) {
        res = await admin.from('orders').insert(baseRecord).select('id').maybeSingle();
      }
      orderId = (res.data as { id?: string } | null)?.id ?? null;
    }

    // --- Shell mode: no Stripe keys → simulate success ----------------------
    if (!isStripeConfigured()) {
      return NextResponse.json({
        simulated: true,
        url: `${siteUrl}/checkout?status=success&sim=1`,
      });
    }

    // --- Stripe Checkout (card only: Visa/Mastercard, no wallets) -----------
    const stripe = getStripe()!;
    const stripeCurrency = chargeCurrency.toLowerCase();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      // Card only. Not enabling wallets/alternative methods keeps the session
      // restricted to card networks (Visa & Mastercard accepted).
      payment_method_types: ['card'],
      line_items: [
        ...items.map((i) => ({
          quantity: i.quantity,
          price_data: {
            currency: stripeCurrency,
            unit_amount: toMinorUnits(i.price, lockedRate, meta.decimals),
            product_data: {
              name: i.name,
              description: i.customization ? `Custom: ${i.customization}` : i.sku,
            },
          },
        })),
        {
          quantity: 1,
          price_data: {
            currency: stripeCurrency,
            unit_amount: toMinorUnits(shippingAUD, lockedRate, meta.decimals),
            product_data: { name: `Shipping — ${region.label}` },
          },
        },
      ],
      success_url: `${siteUrl}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout?status=cancelled`,
      metadata: {
        orderId: orderId ?? '',
        country,
        base_currency: BASE_CURRENCY,
        aud_total: totalAUD.toFixed(2),
        charged_currency: chargeCurrency,
        charged_amount: chargedAmount.toFixed(meta.decimals),
        fx_rate: String(lockedRate),
      },
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
