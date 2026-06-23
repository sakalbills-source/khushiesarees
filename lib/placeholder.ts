// Fallback image used when a product has no images (guards next/image against
// undefined src so empty/partial catalogue rows never crash the UI).
// placehold.co is allowlisted in next.config.js.
export const PLACEHOLDER_IMAGE =
  'https://placehold.co/800x1067/f5f5f4/9ca3af?text=KSarees';

/** First image of a product, or the placeholder when none/empty. */
export function firstImage(images?: string[] | null): string {
  return images && images.length > 0 ? images[0] : PLACEHOLDER_IMAGE;
}
