'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { CatalogProduct, getProductBySku } from '@/lib/catalog';

// The bag holds SKUs only. Each saree is a single piece, so quantity is 1.
// Names and prices are always read from the catalogue (and re-checked on the
// server at checkout), never from what is stored in the browser.
const STORAGE_KEY = 'ks_bag_v1';

interface CartContextValue {
  skus: string[];
  products: CatalogProduct[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  has: (sku: string) => boolean;
  add: (sku: string) => void;
  remove: (sku: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [skus, setSkus] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSkus(parsed.filter((s) => typeof s === 'string' && getProductBySku(s)));
      }
    } catch {
      /* storage unavailable */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skus));
    } catch {
      /* storage unavailable */
    }
  }, [skus, hydrated]);

  const add = useCallback((sku: string) => setSkus((prev) => (prev.includes(sku) ? prev : [...prev, sku])), []);
  const remove = useCallback((sku: string) => setSkus((prev) => prev.filter((s) => s !== sku)), []);
  const clear = useCallback(() => setSkus([]), []);
  const has = useCallback((sku: string) => skus.includes(sku), [skus]);

  const value = useMemo(() => {
    const products = skus.map((s) => getProductBySku(s)).filter(Boolean) as CatalogProduct[];
    return {
      skus,
      products,
      count: products.length,
      subtotal: products.reduce((n, p) => n + p.priceAud, 0),
      hydrated,
      has,
      add,
      remove,
      clear,
    };
  }, [skus, hydrated, has, add, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
