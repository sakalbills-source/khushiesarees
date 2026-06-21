'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();
  const params = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(p: number) {
    const next = new URLSearchParams(params.toString());
    next.set('page', String(p));
    router.push(`/products?${next.toString()}`);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-sm disabled:opacity-40 hover:border-gold"
      >
        Prev
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`px-3 py-1.5 text-sm border rounded-sm ${
            p === page
              ? 'bg-gold border-gold text-charcoal font-semibold'
              : 'border-gray-300 hover:border-gold'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-sm disabled:opacity-40 hover:border-gold"
      >
        Next
      </button>
    </div>
  );
}
