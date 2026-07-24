import type { Metadata } from 'next';
import AdminProductsPageClient from '@/components/AdminProductsPageClient';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return <AdminProductsPageClient />;
}
