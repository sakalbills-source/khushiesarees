'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { formatINR } from '@/lib/format';
import { useCart } from './CartProvider';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      product_id: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      image: product.images[0],
    });
  }

  return (
    <div className="group bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <Link href={`/products/${product.sku}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.in_stock && (
          <span className="absolute top-2 left-2 bg-charcoal/80 text-white text-[10px] px-2 py-1 rounded-sm">
            Out of stock
          </span>
        )}
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-[11px] uppercase tracking-wide text-gold-dark mb-1">
          {product.fabric}
        </p>
        <Link href={`/products/${product.sku}`} className="flex-1">
          <h3 className="font-sans text-sm font-medium text-charcoal line-clamp-2 hover:text-gold-dark transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 font-serif text-lg font-semibold text-charcoal">
          {formatINR(product.price)}
        </p>
        <button
          onClick={handleAdd}
          disabled={!product.in_stock}
          className="btn-gold mt-3 text-sm w-full"
        >
          {product.in_stock ? 'Add to Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
}
