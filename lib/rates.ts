// NOTE: server-only module. Only import from server components / route handlers
// (it holds a process-level cache and performs outbound fetches).
import { BASE_CURRENCY, CURRENCY_CODES, CurrencyCode } from './currency';

// ============================================================================
// Live FX rates with a ~1 hour server-side cache.
//
// Source of truth: a free public API (open.er-api.com, AUD as base). Rates are
// NEVER hardcoded. If the API is unreachable we fall back to the last cached
// rates and flag the payload as `stale` so the UI can show a "rates as of …"
// note. If there is no cache at all (cold start + API down) we degrade to
// base-only (AUD=1), which keeps AUD pricing working.
// ============================================================================

const TTL_MS = 60 * 60 * 1000; // 1 hour
const PRIMARY_URL = `https://open.er-api.com/v6/latest/${BASE_CURRENCY}`;
const FALLBACK_URL = `https://api.exchangerate.host/latest?base=${BASE_CURRENCY}`;

export interface RatesPayload {
  base: CurrencyCode;
  /** AUD->code multipliers for every supported currency. */
  rates: Record<string, number>;
  /** Unix ms — when the upstream provider last updated these rates. */
  ratesUpdatedAt: number;
  /** True when served from cache because the live fetch failed. */
  stale: boolean;
}

interface CacheEntry {
  rates: Record<string, number>;
  ratesUpdatedAt: number;
  fetchedAt: number; // for TTL bookkeeping
}

// Module-level cache. Survives across requests within a warm server instance.
let cache: CacheEntry | null = null;

function pickSupported(all: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = { [BASE_CURRENCY]: 1 };
  for (const code of CURRENCY_CODES) {
    if (typeof all[code] === 'number' && all[code] > 0) out[code] = all[code];
  }
  return out;
}

async function fetchLive(): Promise<CacheEntry | null> {
  // Try the primary provider, then a fallback provider. Both are keyless and
  // return AUD-based rates.
  for (const url of [PRIMARY_URL, FALLBACK_URL]) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const data = await res.json();
      const raw: Record<string, number> | undefined = data?.rates;
      if (!raw) continue;
      const updated =
        typeof data.time_last_update_unix === 'number'
          ? data.time_last_update_unix * 1000
          : Date.now();
      return {
        rates: pickSupported(raw),
        ratesUpdatedAt: updated,
        fetchedAt: Date.now(),
      };
    } catch {
      // try next provider
    }
  }
  return null;
}

export async function getRates(): Promise<RatesPayload> {
  const now = Date.now();

  // Fresh cache within TTL — serve as-is.
  if (cache && now - cache.fetchedAt < TTL_MS) {
    return {
      base: BASE_CURRENCY,
      rates: cache.rates,
      ratesUpdatedAt: cache.ratesUpdatedAt,
      stale: false,
    };
  }

  const live = await fetchLive();
  if (live) {
    cache = live;
    return {
      base: BASE_CURRENCY,
      rates: live.rates,
      ratesUpdatedAt: live.ratesUpdatedAt,
      stale: false,
    };
  }

  // API unreachable — fall back to last cached rates if we have them.
  if (cache) {
    return {
      base: BASE_CURRENCY,
      rates: cache.rates,
      ratesUpdatedAt: cache.ratesUpdatedAt,
      stale: true,
    };
  }

  // Cold start + API down: base-only so AUD pricing still works.
  return {
    base: BASE_CURRENCY,
    rates: { [BASE_CURRENCY]: 1 },
    ratesUpdatedAt: now,
    stale: true,
  };
}
