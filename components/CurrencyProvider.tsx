'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  BASE_CURRENCY,
  CurrencyCode,
  CURRENCIES,
  formatMoney,
  getCurrency,
  isCurrencyCode,
} from '@/lib/currency';

const CURRENCY_KEY = 'ksarees_currency';
const RATES_KEY = 'ksarees_rates';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

interface RatesState {
  rates: Record<string, number>;
  ratesUpdatedAt: number;
  stale: boolean;
}

interface CurrencyContextValue {
  /** Selected display/checkout currency. */
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  /** AUD->selected multiplier actually in effect (1 when AUD or rate missing). */
  rate: number;
  /** Convert an AUD base amount into the selected currency. */
  convert: (aud: number) => number;
  /** Format an AUD base amount in the selected currency (correct symbol/decimals). */
  format: (aud: number) => string;
  /** True once rates have loaded (client-side). */
  ready: boolean;
  /** Upstream rate timestamp (unix ms) + staleness, for the "rates as of …" note. */
  ratesUpdatedAt: number;
  stale: boolean;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(BASE_CURRENCY);
  const [ratesState, setRatesState] = useState<RatesState>({
    rates: { [BASE_CURRENCY]: 1 },
    ratesUpdatedAt: 0,
    stale: false,
  });
  const [ready, setReady] = useState(false);

  // Restore the saved currency (localStorage, then cookie) on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_KEY) ?? readCookie(CURRENCY_KEY);
      if (saved && isCurrencyCode(saved)) setCurrencyState(saved);
    } catch {
      /* ignore */
    }

    // Seed from any cached rates so reloads (even offline) have something.
    try {
      const cached = localStorage.getItem(RATES_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as RatesState;
        if (parsed?.rates) {
          setRatesState({ ...parsed, stale: true });
          setReady(true);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Fetch live rates from our cached server route.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/rates');
        if (!res.ok) throw new Error('rates fetch failed');
        const data = (await res.json()) as RatesState & { base: string };
        if (cancelled) return;
        const next: RatesState = {
          rates: data.rates,
          ratesUpdatedAt: data.ratesUpdatedAt,
          stale: Boolean(data.stale),
        };
        setRatesState(next);
        try {
          localStorage.setItem(RATES_KEY, JSON.stringify(next));
        } catch {
          /* ignore quota */
        }
      } catch {
        // Keep whatever we restored from cache; mark stale.
        if (!cancelled) setRatesState((s) => ({ ...s, stale: true }));
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(CURRENCY_KEY, code);
    } catch {
      /* ignore */
    }
    try {
      document.cookie = `${CURRENCY_KEY}=${code}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    } catch {
      /* ignore */
    }
  }, []);

  // Effective rate: 1 for AUD; otherwise the live rate, falling back to AUD (1)
  // if that currency's rate is missing (keeps prices sane rather than NaN).
  const liveRate = ratesState.rates[currency];
  const hasRate = currency === BASE_CURRENCY || (typeof liveRate === 'number' && liveRate > 0);
  const rate = currency === BASE_CURRENCY ? 1 : hasRate ? liveRate : 1;
  const effectiveCurrency: CurrencyCode = hasRate ? currency : BASE_CURRENCY;

  const convert = useCallback((aud: number) => aud * rate, [rate]);
  const format = useCallback(
    (aud: number) => formatMoney(aud * rate, effectiveCurrency),
    [rate, effectiveCurrency],
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rate,
        convert,
        format,
        ready,
        ratesUpdatedAt: ratesState.ratesUpdatedAt,
        stale: ratesState.stale,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}

/** Options for a currency <select>, in canonical order. */
export const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({
  code: c.code,
  label: `${c.symbol} ${c.code}`,
  name: c.label,
}));

export { getCurrency };
