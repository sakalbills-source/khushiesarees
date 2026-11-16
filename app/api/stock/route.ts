import { NextResponse } from 'next/server';
import { getStockSafe } from '@/lib/inventory';

export const dynamic = 'force-dynamic';

/** Live availability for every saree: { "KS-001": { available, ... }, ... } */
export async function GET() {
  const stock = await getStockSafe();
  return NextResponse.json(stock, { headers: { 'Cache-Control': 'no-store' } });
}
