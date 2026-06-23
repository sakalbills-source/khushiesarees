'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from './CartProvider';
import CurrencySelector from './CurrencySelector';
import { CATEGORIES } from '@/lib/types';

const WHATSAPP_LINK = 'https://wa.me/910000000000'; // placeholder

export default function Nav() {
  const { count } = useCart();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-charcoal text-white shadow-md">
      {/* Top bar */}
      <div className="bg-gold text-charcoal text-center text-xs py-1.5 font-medium">
        ✦ Worldwide shipping ✦ Prices shown in your chosen currency ✦ Custom stitching available ✦
      </div>

      <nav className="container-px flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-bold tracking-wide text-gold">
          KSarees
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-7 text-sm font-medium">
          <li>
            <Link href="/products" className="hover:text-gold transition-colors">
              All
            </Link>
          </li>
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

        {/* Icons */}
        <div className="flex items-center gap-4">
          <CurrencySelector className="hidden sm:inline-flex" />

          <button
            aria-label="Search"
            onClick={() => setSearchOpen((s) => !s)}
            className="hover:text-gold transition-colors"
          >
            <SearchIcon />
          </button>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hover:text-gold transition-colors"
          >
            <WhatsAppIcon />
          </a>

          <Link
            href="/cart"
            aria-label="Cart"
            className="relative hover:text-gold transition-colors"
          >
            <CartIcon />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-charcoal text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <button
            aria-label="Menu"
            onClick={() => setMobileOpen((m) => !m)}
            className="md:hidden hover:text-gold"
          >
            <MenuIcon />
          </button>
        </div>
      </nav>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-white/10 bg-charcoal">
          <form onSubmit={submitSearch} className="container-px py-3 flex gap-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sarees, lehengas, suits..."
              className="flex-1 rounded-sm px-3 py-2 text-sm text-charcoal focus:outline-none"
            />
            <button type="submit" className="btn-gold py-2">
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-charcoal">
          <ul className="container-px py-3 flex flex-col gap-3 text-sm">
            <li className="sm:hidden pb-1">
              <CurrencySelector />
            </li>
            <li>
              <Link href="/products" onClick={() => setMobileOpen(false)}>
                All Products
              </Link>
            </li>
            {CATEGORIES.map((c) => (
              <li key={c.value}>
                <Link
                  href={`/products?category=${c.value}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.21 8.21 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
