/**
 * Site-wide settings. Anything the owner has not supplied yet is read from an
 * environment variable and is hidden (or shown as a clearly marked
 * placeholder) when empty. Never hard-code a guessed URL, email or number.
 */
const clean = (v?: string) => (v ?? '').trim();

export const SITE_NAME = 'Khushie Sarees';

/** Absolute base URL. Preview deployments use their own Vercel URL. */
export const SITE_URL = (
  clean(process.env.NEXT_PUBLIC_SITE_URL) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'http://localhost:3000'
).replace(/\/$/, '');

export function absoluteUrl(p: string): string {
  return `${SITE_URL}${p.startsWith('/') ? p : `/${p}`}`;
}

/** Owner to supply (OWNER_APPROVAL_CHECKLIST: social profile URLs, contact email). */
export const INSTAGRAM_URL = clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL) || null;
export const TIKTOK_PROFILE_URL = clean(process.env.NEXT_PUBLIC_TIKTOK_URL) || null;
export const CONTACT_EMAIL = clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || null;

/**
 * Draft banner. On by default everywhere except a production deployment, and
 * can be switched off with NEXT_PUBLIC_DRAFT_BANNER=off once the owner signs off.
 */
export const SHOW_DRAFT_BANNER =
  clean(process.env.NEXT_PUBLIC_DRAFT_BANNER) !== 'off' &&
  process.env.VERCEL_ENV !== 'production';

export const DEFAULT_TITLE = 'Khushie Sarees | Sarees in Brisbane, Australia';
export const DEFAULT_DESCRIPTION =
  'Khushie Sarees is a Brisbane saree boutique. Shop modal silk, georgette, art silk and Fendi fabric sarees, photographed as they are, with prices in Australian dollars.';
