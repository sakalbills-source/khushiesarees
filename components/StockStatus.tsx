'use client';

import { useStock } from './useStock';

/** Live "Available" / "Sold out" text (the page itself is cached). */
export default function StockStatus({ sku, initialAvailable, variant = 'line' }: { sku: string; initialAvailable: number; variant?: 'line' | 'detail' }) {
  const { stock } = useStock();
  const available = (stock?.[sku]?.available ?? initialAvailable) > 0;
  if (variant === 'detail') return <>{available ? 'In stock' : 'Sold out'}</>;
  return available ? (
    <span className="text-ink-soft">Available · ready to order</span>
  ) : (
    <span className="font-medium text-kumkum">Sold out</span>
  );
}
