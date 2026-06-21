import { Suspense } from 'react';
import ProductGrid from '@/components/ProductGrid';
import ProductFilters from '@/components/ProductFilters';
import Pagination from '@/components/Pagination';
import { getProducts } from '@/lib/products';
import { Category } from '@/lib/types';

const PER_PAGE = 12;

export const metadata = { title: 'Shop All — KSarees' };

type SearchParams = { [key: string]: string | string[] | undefined };

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(str(sp.page) ?? '1', 10) || 1);
  const category = (str(sp.category) as Category | undefined) ?? 'all';
  const fabric = str(sp.fabric);
  const search = str(sp.search);
  const maxPrice = str(sp.maxPrice) ? Number(str(sp.maxPrice)) : undefined;
  const sort = (str(sp.sort) as
    | 'newest'
    | 'price-asc'
    | 'price-desc'
    | 'name'
    | undefined) ?? 'newest';

  const { products, total } = await getProducts({
    category,
    fabric,
    search,
    maxPrice,
    sort,
    page,
    perPage: PER_PAGE,
  });

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="container-px py-10">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-charcoal">
          {search ? `Results for “${search}”` : 'Shop All'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{total} products</p>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 self-start">
          <Suspense fallback={<div>Loading filters…</div>}>
            <ProductFilters />
          </Suspense>
        </aside>

        <div>
          <ProductGrid products={products} />
          <Suspense fallback={null}>
            <Pagination page={page} totalPages={totalPages} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
