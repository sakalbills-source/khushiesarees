'use client';
import { useEffect } from 'react';
import { useCart } from './CartProvider';

export default function ClearCart({ skus }: { skus: string[] }) {
  const { remove, hydrated } = useCart();
  useEffect(() => {
    if (hydrated) skus.forEach((s) => remove(s));
  }, [hydrated, skus, remove]);
  return null;
}
