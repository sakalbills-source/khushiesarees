import { NextResponse } from 'next/server';
import { getRates } from '@/lib/rates';

// Always evaluate on the server so the 1h in-memory cache (lib/rates) governs
// freshness rather than Next's static cache.
export const dynamic = 'force-dynamic';

export async function GET() {
  const payload = await getRates();
  // Allow the browser/CDN to reuse for a short window; the authoritative TTL is
  // the server-side cache in lib/rates.
  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600' },
  });
}
