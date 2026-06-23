'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { CATEGORIES, FABRICS } from '@/lib/types';

export default function ProductFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete('page'); // reset pagination on filter change
      router.push(`/products?${next.toString()}`);
    },
    [params, router],
  );

  const category = params.get('category') ?? 'all';
  const fabric = params.get('fabric') ?? '';
  const sort = params.get('sort') ?? 'newest';
  const maxPrice = params.get('maxPrice') ?? '';

  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h4 className="font-semibold text-sm mb-2">Category</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setParam('category', '')}
            className={`text-xs px-3 py-1.5 rounded-sm border ${
              category === 'all'
                ? 'bg-gold border-gold text-charcoal'
                : 'border-gray-300 hover:border-gold'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setParam('category', c.value)}
              className={`text-xs px-3 py-1.5 rounded-sm border ${
                category === c.value
                  ? 'bg-gold border-gold text-charcoal'
                  : 'border-gray-300 hover:border-gold'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fabric */}
      <div>
        <h4 className="font-semibold text-sm mb-2">Fabric</h4>
        <select
          value={fabric}
          onChange={(e) => setParam('fabric', e.target.value)}
          className="input"
        >
          <option value="">All fabrics</option>
          {FABRICS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      {/* Max price */}
      <div>
        <h4 className="font-semibold text-sm mb-2">Max Price (AUD)</h4>
        <select
          value={maxPrice}
          onChange={(e) => setParam('maxPrice', e.target.value)}
          className="input"
        >
          <option value="">Any</option>
          <option value="50">Under A$50</option>
          <option value="100">Under A$100</option>
          <option value="250">Under A$250</option>
          <option value="500">Under A$500</option>
        </select>
        <p className="text-[11px] text-gray-400 mt-1">
          Filtered on AUD base price.
        </p>
      </div>

      {/* Sort */}
      <div>
        <h4 className="font-semibold text-sm mb-2">Sort By</h4>
        <select
          value={sort}
          onChange={(e) => setParam('sort', e.target.value)}
          className="input"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      <button
        onClick={() => router.push('/products')}
        className="text-xs text-gold-dark hover:underline"
      >
        Clear all filters
      </button>
    </div>
  );
}
