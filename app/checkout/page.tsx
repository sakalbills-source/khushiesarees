import type { Metadata } from 'next';
import CheckoutPageClient from '@/components/CheckoutPageClient';

export const metadata: Metadata = {
  title: 'Checkout',
  description:
    'Secure checkout for your KSarees order. Choose your shipping region — Australia, New Zealand, Fiji, UK, USA or the Caribbean — and pay securely by card.',
  alternates: { canonical: '/checkout' },
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
