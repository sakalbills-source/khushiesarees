import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { getAllProductsAdmin } from '@/lib/products';
import { Product } from '@/lib/types';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';

function authorized(req: NextRequest): boolean {
  return req.headers.get('x-admin-password') === ADMIN_PASSWORD;
}

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// List products
export async function GET(req: NextRequest) {
  if (!authorized(req)) return unauthorized();
  const products = await getAllProductsAdmin();
  return NextResponse.json({ products });
}

// Create
export async function POST(req: NextRequest) {
  if (!authorized(req)) return unauthorized();
  const body = (await req.json()) as Partial<Product>;
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Supabase not configured — connect a database to persist products.' },
      { status: 503 },
    );
  }
  const { data, error } = await admin.from('products').insert(body).select().maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ product: data });
}

// Update
export async function PUT(req: NextRequest) {
  if (!authorized(req)) return unauthorized();
  const body = (await req.json()) as Product;
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Supabase not configured — connect a database to persist products.' },
      { status: 503 },
    );
  }
  const { data, error } = await admin
    .from('products')
    .update(body)
    .eq('id', body.id)
    .select()
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ product: data });
}

// Delete
export async function DELETE(req: NextRequest) {
  if (!authorized(req)) return unauthorized();
  const { id } = (await req.json()) as { id: string };
  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Supabase not configured — connect a database to persist products.' },
      { status: 503 },
    );
  }
  const { error } = await admin.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
