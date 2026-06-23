import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products?: Product[] | null;
  emptyTitle?: string;
  emptyText?: string;
}

/** Clean, crash-proof grid. Tolerates null/undefined/empty product arrays. */
export default function ProductGrid({
  products,
  emptyTitle = 'Coming soon',
  emptyText = 'New pieces are on their way. Check back shortly.',
}: ProductGridProps) {
  const list = Array.isArray(products) ? products : [];

  if (list.length === 0) {
    return (
      <div className="text-center py-16 px-4 border border-dashed border-gray-200 rounded-sm bg-gray-50/50">
        <p className="text-gold-dark text-xs uppercase tracking-[0.25em] mb-2">
          {emptyTitle}
        </p>
        <p className="text-gray-500 text-sm max-w-md mx-auto">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {list.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
