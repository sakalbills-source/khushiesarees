// ============================================================================
// Multi-currency support.
//
// AUD is the canonical base currency: every product price is authored, stored,
// and reasoned about in AUD. Conversion to other currencies is a DISPLAY /
// CHECKOUT concern only — it never mutates stored data.
// ============================================================================

export type CurrencyCode = 'AUD' | 'USD' | 'FJD' | 'EUR' | 'GBP';

/** The single source of truth. All prices are stored in this currency. */
export const BASE_CURRENCY: CurrencyCode = 'AUD';

export interface CurrencyMeta {
  code: CurrencyCode;
  label: string;
  /** Unambiguous display symbol (A$, US$, FJ$, €, £). */
  symbol: string;
  locale: string;
  /** Decimal places for display + Stripe minor-unit math. */
  decimals: number;
}

export const CURRENCIES: CurrencyMeta[] = [
  { code: 'AUD', label: 'Australian Dollar', symbol: 'A$', locale: 'en-AU', decimals: 2 },
  { code: 'USD', label: 'US Dollar', symbol: 'US$', locale: 'en-US', decimals: 2 },
  { code: 'FJD', label: 'Fijian Dollar', symbol: 'FJ$', locale: 'en-FJ', decimals: 2 },
  { code: 'EUR', label: 'Euro', symbol: '€', locale: 'en-IE', decimals: 2 },
  { code: 'GBP', label: 'Pound Sterling', symbol: '£', locale: 'en-GB', decimals: 2 },
];

export const CURRENCY_CODES: CurrencyCode[] = CURRENCIES.map((c) => c.code);

export function isCurrencyCode(v: string): v is CurrencyCode {
  return (CURRENCY_CODES as string[]).includes(v);
}

export function getCurrency(code: string): CurrencyMeta {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/** Convert an AUD base amount into `code` using a live rate (AUD->code). */
export function convertFromAUD(aud: number, rate: number): number {
  return aud * rate;
}

/**
 * Format an amount already expressed in `code`. Uses an explicit symbol prefix
 * (so AUD/USD/FJD never collapse to a bare "$") plus locale-aware grouping and
 * the currency's decimal places.
 */
export function formatMoney(amount: number, code: CurrencyCode): string {
  const meta = getCurrency(code);
  const num = amount.toLocaleString(meta.locale, {
    minimumFractionDigits: meta.decimals,
    maximumFractionDigits: meta.decimals,
  });
  return `${meta.symbol}${num}`;
}

/** Convenience: format an AUD base amount into the target currency. */
export function formatFromAUD(aud: number, code: CurrencyCode, rate: number): string {
  return formatMoney(convertFromAUD(aud, rate), code);
}
