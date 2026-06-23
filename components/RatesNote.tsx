'use client';

import { useCurrency } from './CurrencyProvider';
import { BASE_CURRENCY } from '@/lib/currency';

/**
 * Quiet "rates as of …" note. Only meaningful once a non-base currency is
 * selected; shows a gentle hint when rates are stale (served from cache).
 */
export default function RatesNote() {
  const { currency, ready, ratesUpdatedAt, stale } = useCurrency();

  if (!ready || currency === BASE_CURRENCY) return null;

  const when = ratesUpdatedAt
    ? new Date(ratesUpdatedAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'recently';

  return (
    <p className="text-[11px] text-gray-500">
      Prices in {currency} are converted from {BASE_CURRENCY}. FX rates as of {when}
      {stale ? ' (last cached — live rates unavailable)' : ''}.
    </p>
  );
}
