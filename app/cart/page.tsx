import type { Metadata } from 'next';
import { Suspense } from 'react';
import CartView from '@/components/CartView';

export const metadata: Metadata = { title: 'Your Bag', robots: { index: false, follow: false } };

export default function CartPage() {
  return (
    <div className="container-px pt-12">
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <CartView />
      </Suspense>
    </div>
  );
}
