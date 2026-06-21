import Link from 'next/link';
import { CATEGORIES } from '@/lib/types';
import { SHIPPING_REGIONS } from '@/lib/shipping';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-gray-300 mt-16">
      <div className="container-px py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="text-gold font-serif text-xl mb-3">KSarees</h4>
          <p className="text-gray-400 leading-relaxed">
            Premium Indian ethnic wear, shipped worldwide. Handpicked sarees,
            lehengas & more for every celebration.
          </p>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-3">Shop</h5>
          <ul className="space-y-2">
            {CATEGORIES.map((c) => (
              <li key={c.value}>
                <Link
                  href={`/products?category=${c.value}`}
                  className="hover:text-gold transition-colors"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-3">We Ship To</h5>
          <ul className="space-y-2 text-gray-400">
            {SHIPPING_REGIONS.map((r) => (
              <li key={r.code}>{r.label}</li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white mb-3">Help</h5>
          <ul className="space-y-2">
            <li>
              <a href="https://wa.me/910000000000" className="hover:text-gold">
                WhatsApp Support
              </a>
            </li>
            <li>
              <Link href="/cart" className="hover:text-gold">
                Your Cart
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className="hover:text-gold">
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} KSarees. All rights reserved. Built with Next.js.
      </div>
    </footer>
  );
}
