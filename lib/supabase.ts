import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Returns true when Supabase env vars are present. When false, the app falls
 * back to local mock/seed data so the shell runs with zero configuration.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

/** Browser/anon client. Returns null when not configured. */
export function getSupabaseClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

/** Server-side privileged client (service role). Returns null when not configured. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
