// Server-only. Stock tracking for the catalogue in lib/catalog.ts.
//
// Where stock lives (picked automatically, first match wins):
//   1. Supabase  — table `inventory` (see supabase/khushie_inventory.sql). The
//                  Stripe webhook decrements it once per paid order, atomically
//                  and idempotently (function ks_record_sale).
//   2. File      — INVENTORY_BACKEND=file, local development only (.data/).
//   3. Stripe    — no database: sold units are counted from paid Stripe
//                  Checkout Sessions tagged with the SKU, so stock still goes
//                  down automatically on every paid order.
//   4. None      — no Stripe and no database: draft stock from the catalogue,
//                  checkout is switched off.
//
// In every mode, units in an open (unexpired, unpaid) Stripe Checkout Session
// count as held, so two shoppers cannot pay for the same single saree.
import { promises as fs } from 'fs';
import path from 'path';
import type Stripe from 'stripe';
import { PRODUCTS, getProductBySku } from './catalog';
import { getSupabaseAdmin } from './supabase';
import { getStripe } from './stripe';

export type InventoryBackend = 'supabase' | 'file' | 'stripe' | 'none';

export interface StockInfo {
  sku: string;
  /** Units still on the shelf (after paid orders). */
  stock: number;
  /** Units held by shoppers currently in Stripe Checkout. */
  held: number;
  /** stock - held, never below 0. */
  available: number;
}

/** How long a shopper's Checkout Session holds the saree (Stripe minimum is 30 min). */
export const HOLD_MINUTES = 30;

export function inventoryBackend(): InventoryBackend {
  if (getSupabaseAdmin()) return 'supabase';
  if (process.env.INVENTORY_BACKEND === 'file' && !process.env.VERCEL) return 'file';
  if (getStripe()) return 'stripe';
  return 'none';
}

export function skusFromMetadata(meta: Stripe.Metadata | null | undefined): string[] {
  const raw = meta?.ks_skus ?? '';
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// File backend (local development and automated tests only)
// ---------------------------------------------------------------------------
interface FileState {
  stock: Record<string, number>;
  processedSessions: string[];
  orders: unknown[];
}
const FILE_PATH = path.join(process.cwd(), '.data', 'inventory.json');

async function readFileState(): Promise<FileState> {
  try {
    return JSON.parse(await fs.readFile(FILE_PATH, 'utf8')) as FileState;
  } catch {
    return {
      stock: Object.fromEntries(PRODUCTS.map((p) => [p.sku, p.initialStock])),
      processedSessions: [],
      orders: [],
    };
  }
}
async function writeFileState(s: FileState) {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(s, null, 2));
}

// ---------------------------------------------------------------------------
// Stripe helpers
// ---------------------------------------------------------------------------
async function heldUnits(excludeSessionId?: string): Promise<Record<string, number>> {
  const stripe = getStripe();
  const held: Record<string, number> = {};
  if (!stripe) return held;
  const since = Math.floor(Date.now() / 1000) - (HOLD_MINUTES + 2) * 60;
  try {
    for await (const s of stripe.checkout.sessions.list({
      status: 'open',
      created: { gte: since },
      limit: 100,
    })) {
      if (s.id === excludeSessionId) continue;
      for (const sku of skusFromMetadata(s.metadata)) held[sku] = (held[sku] ?? 0) + 1;
    }
  } catch (err) {
    // If Stripe cannot be reached, checkout cannot start either, so no hold is lost.
    console.error('Could not read open Checkout Sessions:', (err as Error).message);
  }
  return held;
}

async function soldUnitsFromStripe(): Promise<Record<string, number>> {
  const stripe = getStripe();
  const sold: Record<string, number> = {};
  if (!stripe) return sold;
  let seen = 0;
  for await (const s of stripe.checkout.sessions.list({ status: 'complete', limit: 100 })) {
    if (++seen > 2000) break;
    if (s.payment_status !== 'paid') continue;
    for (const sku of skusFromMetadata(s.metadata)) sold[sku] = (sold[sku] ?? 0) + 1;
  }
  return sold;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
async function shelfStock(): Promise<Record<string, number>> {
  const backend = inventoryBackend();
  const base = Object.fromEntries(PRODUCTS.map((p) => [p.sku, p.initialStock]));

  if (backend === 'supabase') {
    const db = getSupabaseAdmin()!;
    // Make sure every catalogue SKU has a row (new sarees start at initialStock).
    await db
      .from('inventory')
      .upsert(
        PRODUCTS.map((p) => ({ sku: p.sku, stock: p.initialStock })),
        { onConflict: 'sku', ignoreDuplicates: true },
      );
    const { data, error } = await db.from('inventory').select('sku, stock');
    if (error) throw new Error(`Inventory lookup failed: ${error.message}`);
    for (const row of data ?? []) base[row.sku as string] = Number(row.stock);
    return base;
  }
  if (backend === 'file') {
    const s = await readFileState();
    return { ...base, ...s.stock };
  }
  if (backend === 'stripe') {
    const sold = await soldUnitsFromStripe();
    for (const sku of Object.keys(base)) base[sku] = Math.max(0, base[sku] - (sold[sku] ?? 0));
    return base;
  }
  return base;
}

export async function getStock(opts: { excludeSessionId?: string } = {}): Promise<
  Record<string, StockInfo>
> {
  const [shelf, held] = await Promise.all([shelfStock(), heldUnits(opts.excludeSessionId)]);
  const out: Record<string, StockInfo> = {};
  for (const p of PRODUCTS) {
    const stock = Math.max(0, shelf[p.sku] ?? 0);
    const h = held[p.sku] ?? 0;
    out[p.sku] = { sku: p.sku, stock, held: h, available: Math.max(0, stock - h) };
  }
  return out;
}

/** Stock for display. Never throws: falls back to draft catalogue stock. */
export async function getStockSafe(): Promise<Record<string, StockInfo>> {
  try {
    return await getStock();
  } catch (err) {
    console.error('Stock lookup failed, showing catalogue stock:', err);
    return Object.fromEntries(
      PRODUCTS.map((p) => [
        p.sku,
        { sku: p.sku, stock: p.initialStock, held: 0, available: p.initialStock },
      ]),
    );
  }
}

export interface SaleResult {
  sessionId: string;
  alreadyProcessed: boolean;
  /** SKUs whose stock was already 0 when payment landed (needs owner follow-up). */
  oversold: string[];
}

/**
 * Record a PAID order: decrement stock by one per SKU, exactly once per
 * Checkout Session. Called from the Stripe webhook only.
 */
export async function recordSale(session: Stripe.Checkout.Session): Promise<SaleResult> {
  const skus = skusFromMetadata(session.metadata).filter((s) => getProductBySku(s));
  const backend = inventoryBackend();
  const order = {
    stripe_session_id: session.id,
    email: session.customer_details?.email ?? session.customer_email ?? '',
    skus,
    amount_total_aud: (session.amount_total ?? 0) / 100,
    currency: session.currency,
    shipping: session.collected_information?.shipping_details ?? null,
    created_at: new Date().toISOString(),
  };

  if (backend === 'supabase') {
    const db = getSupabaseAdmin()!;
    const { data, error } = await db.rpc('ks_record_sale', {
      p_session_id: session.id,
      p_email: order.email,
      p_skus: skus,
      p_amount_aud: order.amount_total_aud,
      p_details: order,
    });
    if (error) throw new Error(`ks_record_sale failed: ${error.message}`);
    const r = (data ?? {}) as { already_processed?: boolean; oversold?: string[] };
    return {
      sessionId: session.id,
      alreadyProcessed: Boolean(r.already_processed),
      oversold: r.oversold ?? [],
    };
  }

  if (backend === 'file') {
    const s = await readFileState();
    if (s.processedSessions.includes(session.id)) {
      return { sessionId: session.id, alreadyProcessed: true, oversold: [] };
    }
    const oversold: string[] = [];
    for (const sku of skus) {
      const cur = s.stock[sku] ?? getProductBySku(sku)!.initialStock;
      if (cur <= 0) oversold.push(sku);
      s.stock[sku] = Math.max(0, cur - 1);
    }
    s.processedSessions.push(session.id);
    s.orders.push({ ...order, oversold });
    await writeFileState(s);
    return { sessionId: session.id, alreadyProcessed: false, oversold };
  }

  // Stripe ledger: the paid session itself is the record; nothing to write.
  return { sessionId: session.id, alreadyProcessed: false, oversold: [] };
}
