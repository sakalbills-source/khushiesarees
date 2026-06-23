'use client';

import { CurrencyCode } from '@/lib/currency';
import { useCurrency, CURRENCY_OPTIONS } from './CurrencyProvider';

/** Header currency dropdown. Persists across navigation/reload via the provider. */
export default function CurrencySelector({ className = '' }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <label className={`relative inline-flex items-center ${className}`}>
      <span className="sr-only">Display currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        aria-label="Display currency"
        className="appearance-none bg-transparent border border-white/25 text-white text-xs font-medium rounded-sm pl-2.5 pr-6 py-1.5 cursor-pointer hover:border-gold focus:outline-none focus:border-gold transition-colors"
      >
        {CURRENCY_OPTIONS.map((o) => (
          <option key={o.code} value={o.code} className="text-charcoal">
            {o.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute right-1.5 h-3.5 w-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </label>
  );
}
