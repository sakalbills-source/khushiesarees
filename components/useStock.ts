'use client';

import { useEffect, useState } from 'react';

export type StockMap = Record<string, { available: number; stock: number; held: number }>;

/** Live availability from /api/stock (pages are cached, stock is not). */
export function useStock(initial?: StockMap) {
  const [stock, setStock] = useState<StockMap | undefined>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch('/api/stock', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d) setStock(d);
      })
      .catch(() => {})
      .finally(() => alive && setLoaded(true));
    return () => {
      alive = false;
    };
  }, []);
  return { stock, loaded };
}
