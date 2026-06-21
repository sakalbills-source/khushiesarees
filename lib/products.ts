import { Product, Category } from './types';
import { MOCK_PRODUCTS } from './mockData';
import { getSupabaseClient, getSupabaseAdmin, isSupabaseConfigured } from './supabase';

export interface ProductQuery {
  category?: Category | 'all';
  fabric?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'name';
  page?: number;
  perPage?: number;
}

export interface ProductResult {
  products: Product[];
  total: number;
}

function applyFilters(all: Product[], q: ProductQuery): Product[] {
  let list = [...all];
  if (q.category && q.category !== 'all') {
    list = list.filter((p) => p.category === q.category);
  }
  if (q.fabric) {
    list = list.filter((p) => p.fabric.toLowerCase() === q.fabric!.toLowerCase());
  }
  if (q.search) {
    const s = q.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s),
    );
  }
  if (typeof q.minPrice === 'number') list = list.filter((p) => p.price >= q.minPrice!);
  if (typeof q.maxPrice === 'number') list = list.filter((p) => p.price <= q.maxPrice!);

  switch (q.sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break;
  }
  return list;
}

/** Fetch products with optional filters. Falls back to mock data. */
export async function getProducts(q: ProductQuery = {}): Promise<ProductResult> {
  const perPage = q.perPage ?? 12;
  const page = q.page ?? 1;

  let all: Product[];
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase.from('products').select('*');
    all = !error && data && data.length ? (data as Product[]) : MOCK_PRODUCTS;
  } else {
    all = MOCK_PRODUCTS;
  }

  const filtered = applyFilters(all, q);
  const total = filtered.length;
  const start = (page - 1) * perPage;
  return { products: filtered.slice(start, start + perPage), total };
}

/** Fetch a single product by SKU. Falls back to mock data. */
export async function getProductBySku(sku: string): Promise<Product | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('sku', sku)
      .maybeSingle();
    if (!error && data) return data as Product;
  }
  return MOCK_PRODUCTS.find((p) => p.sku === sku) ?? null;
}

/** Featured products per category for the home page. */
export async function getFeaturedByCategory(
  category: Category,
  limit = 8,
): Promise<Product[]> {
  const { products } = await getProducts({ category, perPage: limit, page: 1 });
  return products;
}

/** Admin: full product list (uses service role when available). */
export async function getAllProductsAdmin(): Promise<Product[]> {
  const admin = getSupabaseAdmin();
  if (admin) {
    const { data, error } = await admin
      .from('products')
      .select('*')
      .order('sku', { ascending: true });
    if (!error && data) return data as Product[];
  }
  return MOCK_PRODUCTS;
}

export { isSupabaseConfigured };
