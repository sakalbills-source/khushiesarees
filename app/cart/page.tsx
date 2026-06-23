'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/CartProvider';
import { useCurrency } from '@/components/CurrencyProvider';
import { PLACEHOLDER_IMAGE } from '@/lib/placeholder';

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem, clear } = useCart();
  const { format } = useCurrency();

  if (items.length === 0) {
    return (
      <div className="container-px py-20 text-center">
        <h1 className="font-serif text-3xl mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link href="/products" className="btn-gold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-px py-10">
      <h1 className="font-serif text-4xl mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-10">
        {/* Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.sku}
              className="flex gap-4 border border-gray-100 rounded-sm p-3"
            >
              <Link
                href={`/products/${item.sku}`}
                className="relative w-24 h-32 shrink-0 bg-gray-100 rounded-sm overflow-hidden"
              >
                <Image
                  src={item.image || PLACEHOLDER_IMAGE}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </Link>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between gap-3">
                  <Link
                    href={`/products/${item.sku}`}
                    className="font-medium text-sm hover:text-gold-dark"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.sku)}
                    className="text-gray-400 hover:text-red-600 text-sm"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                {item.customization && (
                  <p className="text-xs text-gold-dark mt-1">
                    Custom: {item.customization}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center border border-gray-300 rounded-sm">
                    <button
                      onClick={() => updateQty(item.sku, item.quantity - 1)}
                      className="px-2.5 py-1 hover:text-gold-dark"
                    >
                      −
                    </button>
                    <span className="px-3 text-sm w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.sku, item.quantity + 1)}
                      className="px-2.5 py-1 hover:text-gold-dark"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold">
                    {format(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={clear}
            className="text-xs text-gray-500 hover:text-red-600"
          >
            Clear cart
          </button>
        </div>

        {/* Summary */}
        <aside className="bg-gray-50 border border-gray-100 rounded-sm p-6 h-fit lg:sticky lg:top-24">
          <h2 className="font-serif text-xl mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span className="font-medium">{format(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold">
            <span>Estimated Total</span>
            <span>{format(subtotal)}</span>
          </div>
          <Link href="/checkout" className="btn-gold w-full mt-6">
            Proceed to Checkout
          </Link>
          <Link
            href="/products"
            className="block text-center text-sm text-gold-dark mt-3 hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
