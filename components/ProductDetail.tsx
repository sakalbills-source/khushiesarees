'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { firstImage, PLACEHOLDER_IMAGE } from '@/lib/placeholder';
import { useCart } from './CartProvider';
import { useCurrency } from './CurrencyProvider';

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { format } = useCurrency();
  const images = product.images && product.images.length > 0 ? product.images : [];
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(
      {
        product_id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        image: firstImage(product.images),
        customization: customize && customNote ? customNote : undefined,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="container-px py-10">
      <nav className="text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-gold-dark">Home</Link> /{' '}
        <Link href="/products" className="hover:text-gold-dark">Shop</Link> /{' '}
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden">
            <Image
              src={images[activeImg] ?? PLACEHOLDER_IMAGE}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-20 h-24 rounded-sm overflow-hidden border-2 ${
                    i === activeImg ? 'border-gold' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="text-xs uppercase tracking-wide text-gold-dark mb-2">
            {product.fabric} · {product.category}
          </p>
          <h1 className="font-serif text-3xl text-charcoal mb-3">{product.name}</h1>
          <p className="font-serif text-2xl font-semibold text-charcoal mb-1">
            {format(product.price)}
          </p>
          <p className="text-xs text-gray-500 mb-5">SKU: {product.sku}</p>

          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

          {/* Stock */}
          <p className={`text-sm mb-6 ${product.in_stock ? 'text-green-700' : 'text-red-600'}`}>
            {product.in_stock ? '● In stock — ready to ship' : '● Currently out of stock'}
          </p>

          {/* Customization toggle */}
          <div className="border border-gray-200 rounded-sm p-4 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={customize}
                onChange={(e) => setCustomize(e.target.checked)}
                className="h-4 w-4 accent-gold"
              />
              <span className="font-medium text-sm">
                Add customization / stitching instructions
              </span>
            </label>
            {customize && (
              <textarea
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Blouse size M, fall & pico, padded blouse..."
                rows={3}
                className="input mt-3"
              />
            )}
          </div>

          {/* Quantity + add */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center border border-gray-300 rounded-sm">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-lg hover:text-gold-dark"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-4 text-sm font-medium w-10 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 text-lg hover:text-gold-dark"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!product.in_stock}
              className="btn-gold flex-1"
            >
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
          </div>

          <Link href="/cart" className="btn-outline w-full mb-6">
            Go to Cart
          </Link>

          {/* Size guide */}
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={() => setShowSizeGuide((s) => !s)}
              className="flex items-center justify-between w-full text-sm font-medium"
            >
              <span>Size Guide</span>
              <span>{showSizeGuide ? '−' : '+'}</span>
            </button>
            {showSizeGuide && (
              <pre className="mt-3 text-xs text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">
                {product.size_guide}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
