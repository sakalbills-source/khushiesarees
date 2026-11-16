'use client';

import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { useStock, StockMap } from './useStock';
import type { CatalogProduct } from '@/lib/catalog';

export default function ShopGrid({ products, initialStock }: { products: CatalogProduct[]; initialStock: StockMap }) {
  const { stock } = useStock(initialStock);
  const [fabric, setFabric] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const fabrics = useMemo(() => Array.from(new Set(products.map((p) => p.fabric))), [products]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    let l = products.filter((p) => fabric === 'all' || p.fabric === fabric);
    if (q) {
      l = l.filter((p) =>
        [p.title, p.colour, p.fabric, p.work, ...p.tags].join(' ').toLowerCase().includes(q),
      );
    }
    if (sort === 'price-asc') l = [...l].sort((a, b) => a.priceAud - b.priceAud);
    if (sort === 'price-desc') l = [...l].sort((a, b) => b.priceAud - a.priceAud);
    return l;
  }, [products, fabric, query, sort]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-zari/20 py-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by fabric" className="flex flex-wrap gap-2">
          {['all', ...fabrics].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFabric(f)}
              aria-pressed={fabric === f}
              className={`min-h-[40px] rounded-full border px-4 text-sm transition-colors ${
                fabric === f ? 'border-kumkum bg-kumkum text-cream' : 'border-ink/20 text-ink hover:border-kumkum'
              }`}
            >
              {f === 'all' ? 'All sarees' : f}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <label className="flex-1 md:w-56">
            <span className="sr-only">Search sarees</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search colour, fabric…"
              className="h-10 w-full rounded-sm border border-ink/20 bg-cream px-3 text-sm placeholder:text-ink-mute focus:border-kumkum focus:outline-none"
            />
          </label>
          <label>
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-10 rounded-sm border border-ink/20 bg-cream px-2 text-sm focus:border-kumkum focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-mute" aria-live="polite">
        {list.length} {list.length === 1 ? 'saree' : 'sarees'}
      </p>
      {list.length === 0 ? (
        <p className="py-16 text-center text-ink-soft">No sarees match that search.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-3 lg:gap-x-10">
          {list.map((p, i) => (
            <ProductCard key={p.sku} product={p} priority={i < 2} available={(stock?.[p.sku]?.available ?? 0) > 0} />
          ))}
        </div>
      )}
    </div>
  );
}
