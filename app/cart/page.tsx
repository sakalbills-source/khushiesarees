import type { Metadata } from 'next';
import CartPageClient from '@/components/CartPageClient';

export const metadata: Metadata = {
  title: 'Your Cart',
  description:
    'Review the sarees, lehengas and ethnic wear in your KSarees cart before checkout. Worldwide shipping to Australia, NZ, Fiji, UK, USA and the Caribbean.',
  alternates: { canonical: '/cart' },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartPageClient />;
}
