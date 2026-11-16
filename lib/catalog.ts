/**
 * Khushie Sarees catalogue — the single source of truth for what the shop sells.
 *
 * Source: Khushie_Sarees_Claude_Website_Handover (16 Nov 2026): catalog.json,
 * PRODUCT_DESCRIPTIONS.md and image_manifest.csv. Copy is used word for word.
 *
 * HOW TO ADD THINGS LATER
 * - New saree: add an entry to PRODUCTS with a new SKU and slug, and put its
 *   photos in public/images/sarees/<slug>/. Nothing else needs to change.
 * - Extra photos for an existing saree: append to its `gallery` array. The SKU,
 *   slug (URL), copy and the order of the existing photos stay the same.
 * - TikTok video: set `tiktokProductVideoUrl` to that saree's own video URL.
 *   The "Watch This Saree on TikTok" link appears only when it is set.
 * - Price / stock: edit `priceAud` / `initialStock` here (stock is then tracked
 *   in Supabase once it is connected; see lib/inventory.ts).
 * - Collections: add the collection key to `collections`.
 *
 * Field status flags (`status`) record what the owner has and has not confirmed.
 * They are not shown to customers; they drive the preview report.
 *
 * NOTE ON PHOTOS (16 Nov 2026): in the handover pack the photo folders for
 * KS-002 and KS-004 were swapped (the KS-002 folder held the cream/red-gold art
 * silk saree and the KS-004 folder held the olive-gold saree with the green
 * blouse). Each photo set is attached here to the saree it actually shows,
 * files unchanged and in the pack's order. Alt text follows the saree shown.
 */

export type FieldStatus = 'confirmed' | 'draft' | 'unconfirmed';

export interface GalleryImage {
  src: string;
  width: number;
  height: number;
  alt: string;
  role: string;
}

export interface CatalogProduct {
  sku: string;
  slug: string;
  title: string;
  shortTitle: string;
  priceAud: number;
  fabric: string;
  colour: string;
  work: string;
  shortDescription: string;
  description: string;
  highlights: string[];
  blouse: string;
  petticoat: string;
  sizeAlteration: string;
  included: string[];
  notIncluded: string[];
  tags: string[];
  gallery: GalleryImage[];
  /** Draft stock until the owner confirms. Usually one unit per design. */
  initialStock: number;
  tiktokProductVideoUrl: string | null;
  collections: string[];
  status: Record<string, FieldStatus>;
  openQuestions: string[];
}

const P = (slug: string, file: string) => `/images/sarees/${slug}/${file}`;
const PORTRAIT = { width: 1086, height: 1448 };
const LANDSCAPE = { width: 1448, height: 1086 };

const KS001 = 'ivory-indigo-modal-silk-ajrakh-saree-real-mirror-work';
const KS002 = 'olive-gold-embellished-saree-embroidered-green-blouse';
const KS003 = 'black-multicolour-embroidered-georgette-saree';
const KS004 = 'cream-red-gold-soft-art-silk-saree';
const KS005 = 'red-bandhani-style-embroidered-georgette-saree';

export const PRODUCTS: CatalogProduct[] = [
  {
    sku: 'KS-001',
    slug: KS001,
    title: 'Ivory & Indigo Modal Silk Ajrakh Saree with Real Mirror Work',
    shortTitle: 'Ivory & Indigo Modal Silk Ajrakh Saree',
    priceAud: 80,
    fabric: 'Modal silk',
    colour: 'Warm ivory / cream, indigo, violet, blue-grey',
    work: 'Ajrakh-patterned floral and medallion print with genuine mirror work, ornamental borders and tasselled pallu',
    shortDescription:
      'Discover the beauty of Ajrakh design in soft modal silk, featuring an ivory base, rich indigo and violet motifs, and genuine mirror work that catches the light.',
    description:
      'A striking modal silk Ajrakh saree in warm ivory, deep indigo, violet and blue-grey. The intricate floral and medallion prints are framed by bold patterned borders, while real mirror work adds beautiful reflective detail across the drape. The decorative pallu is finished with dark tassels, creating an elegant look for festive celebrations, cultural occasions and special gatherings. An unstitched blouse piece is included, and the saree comes with its fall and hem already completed. Petticoat not included.',
    highlights: [
      'Modal silk saree with an ivory base and indigo, violet and blue-grey motifs',
      'Ajrakh design with floral and medallion prints',
      'Real mirror work across the border and pallu',
      'Patterned pallu with dark tassels',
      'Fall and hem already completed',
    ],
    blouse: 'Unstitched blouse piece included',
    petticoat: 'Not included',
    sizeAlteration: 'Unstitched blouse piece (no stitched blouse size)',
    included: ['Unstitched blouse piece included', 'Fall and hem completed'],
    notIncluded: ['Petticoat not included'],
    tags: ['modal silk', 'Ajrakh saree', 'real mirror work', 'ivory saree', 'indigo saree', 'festive saree'],
    gallery: [
      { src: P(KS001, '01_front_drape.jpeg'), ...PORTRAIT, role: 'Front drape', alt: 'Ivory & Indigo Modal Silk Ajrakh Saree, front drape' },
      { src: P(KS001, '02_front_closeup.jpeg'), ...PORTRAIT, role: 'Front closeup', alt: 'Ivory & Indigo Modal Silk Ajrakh Saree, front closeup' },
      { src: P(KS001, '03_pallu_and_pleats.jpeg'), ...PORTRAIT, role: 'Pallu and pleats', alt: 'Ivory & Indigo Modal Silk Ajrakh Saree, pallu and pleats' },
      { src: P(KS001, '04_folded_fabric.jpeg'), ...LANDSCAPE, role: 'Folded fabric', alt: 'Ivory & Indigo Modal Silk Ajrakh Saree, folded fabric' },
    ],
    initialStock: 1,
    tiktokProductVideoUrl: null,
    collections: [],
    status: {
      price: 'draft',
      fabric: 'confirmed',
      description: 'draft',
      inclusions: 'draft',
      stock: 'unconfirmed',
      care: 'unconfirmed',
      tiktok: 'unconfirmed',
    },
    openQuestions: [],
  },
  {
    sku: 'KS-002',
    slug: KS002,
    title: 'Olive-Gold Embellished Saree with Embroidered Blouse',
    shortTitle: 'Olive-Gold Embellished Saree',
    priceAud: 120,
    fabric: 'Fendi fabric',
    colour: 'Shimmering olive-gold / muted chartreuse with deep forest-green blouse',
    work: 'Lustrous textured saree with gently curving metallic stripe accents, wide ornate gold-tone border and intricate floral and lattice-pattern embellishment on contrasting deep green blouse',
    shortDescription:
      'An olive-gold Fendi fabric saree with a beautifully embellished deep green stitched blouse, matching petticoat and extra unstitched blouse piece.',
    description:
      'A shimmering olive-gold saree in Fendi fabric with soft flowing lines of metallic detailing and an ornate gold-toned border. The contrasting forest-green stitched blouse makes a beautiful statement with intricate floral motifs, geometric lattice designs and decorative gold-toned accents. Ideal for festive gatherings, celebrations and wedding functions. Comes with a stitched size 38 blouse (no margin for alteration), an additional unstitched blouse piece and a matching petticoat. The saree fall and hem are already completed.',
    highlights: [
      'Olive-gold Fendi fabric with a soft lustrous finish',
      'Curving metallic stripe details and ornate border',
      'Contrasting deep-green embellished blouse with intricate floral and geometric motifs',
      'Stitched blouse size 38 — no margin for alteration',
      'An additional unstitched blouse piece is included',
      'Matching petticoat included; fall and hem completed',
    ],
    blouse: 'Embellished deep-green stitched blouse, plus an extra unstitched blouse piece',
    petticoat: 'Matching petticoat included',
    sizeAlteration: 'Stitched blouse size 38 — no margin for alteration',
    included: [
      'Stitched blouse — size 38 (no margin for alteration)',
      'Extra unstitched blouse piece',
      'Matching petticoat',
      'Fall and hem completed',
    ],
    notIncluded: [],
    tags: ['olive gold saree', 'green blouse', 'embellished border', 'wedding guest', 'festive', 'occasionwear', 'Fendi fabric'],
    gallery: [
      { src: P(KS002, '01_front_drape.jpeg'), ...PORTRAIT, role: 'Front drape', alt: 'Olive-Gold Embellished Saree, front drape' },
      { src: P(KS002, '02_lower_drape.jpeg'), ...PORTRAIT, role: 'Lower drape', alt: 'Olive-Gold Embellished Saree, lower drape' },
      { src: P(KS002, '03_side_pallu.jpeg'), ...PORTRAIT, role: 'Side pallu', alt: 'Olive-Gold Embellished Saree, side pallu' },
      { src: P(KS002, '04_blouse_front_flatlay.jpeg'), ...LANDSCAPE, role: 'Blouse front flatlay', alt: 'Olive-Gold Embellished Saree, blouse front flatlay' },
      { src: P(KS002, '05_blouse_back_flatlay.jpeg'), ...LANDSCAPE, role: 'Blouse back flatlay', alt: 'Olive-Gold Embellished Saree, blouse back flatlay' },
    ],
    initialStock: 1,
    tiktokProductVideoUrl: null,
    collections: [],
    status: {
      price: 'draft',
      fabric: 'confirmed',
      description: 'draft',
      inclusions: 'draft',
      stock: 'unconfirmed',
      care: 'unconfirmed',
      tiktok: 'unconfirmed',
      photos: 'unconfirmed',
    },
    openQuestions: [
      'Photo sets for KS-002 and KS-004 were swapped in the pack; confirm the olive-gold photos belong to KS-002 at AUD 120.',
    ],
  },
  {
    sku: 'KS-003',
    slug: KS003,
    title: 'Black Georgette Saree with Multicolour Floral Embroidery',
    shortTitle: 'Black Multicolour Embroidered Saree',
    priceAud: 95,
    fabric: 'Georgette',
    colour: 'Black with gold-tone, turquoise, pink, orange, purple and green detailing',
    work: 'Combination of handwork and machine embroidery in multicolour floral and paisley patterns along the border, with gold-tone embroidered accents and a heavily embroidered stitched blouse',
    shortDescription:
      'Flowing black georgette with vibrant floral and paisley embroidery combining handwork and machine work, finished with ornate gold-toned accents.',
    description:
      'Make an entrance in this beautiful black georgette saree, richly decorated with multicoloured floral and paisley embroidery in turquoise, pink, orange, purple and green. The embroidery combines detailed handwork and machine work, while the gold-toned border accents contrast elegantly against the black fabric. The included stitched blouse features richly embroidered sleeves and neckline detailing. Perfect for festive gatherings, weddings and evening occasions. The stitched blouse is size 40 and can be altered up to size 42. A matching petticoat is included, and the saree comes with its fall and hem completed.',
    highlights: [
      'Black georgette with a flowing drape',
      'Combination of handwork and machine embroidery',
      'Multicolour floral and paisley motifs with gold-toned border details',
      'Embroidered stitched blouse included — size 40, alterable up to 42',
      'Matching petticoat included; fall and hem completed',
    ],
    blouse: 'Embroidered stitched blouse included',
    petticoat: 'Matching petticoat included',
    sizeAlteration: 'Stitched blouse size 40, can be altered up to size 42',
    included: [
      'Embroidered stitched blouse — size 40, alterable up to 42',
      'Matching petticoat',
      'Fall and hem completed',
    ],
    notIncluded: [],
    tags: ['black georgette saree', 'floral embroidery', 'paisley', 'multicolour', 'evening saree', 'festive'],
    gallery: [
      { src: P(KS003, '01_front_drape.jpeg'), ...PORTRAIT, role: 'Front drape', alt: 'Black Multicolour Embroidered Saree, front drape' },
      { src: P(KS003, '02_lower_pallu.jpeg'), ...PORTRAIT, role: 'Lower pallu', alt: 'Black Multicolour Embroidered Saree, lower pallu' },
      { src: P(KS003, '03_blouse_front_flatlay.jpeg'), ...LANDSCAPE, role: 'Blouse front flatlay', alt: 'Black Multicolour Embroidered Saree, blouse front flatlay' },
      { src: P(KS003, '04_blouse_back_flatlay.jpeg'), ...LANDSCAPE, role: 'Blouse back flatlay', alt: 'Black Multicolour Embroidered Saree, blouse back flatlay' },
    ],
    initialStock: 1,
    tiktokProductVideoUrl: null,
    collections: [],
    status: {
      price: 'draft',
      fabric: 'confirmed',
      embroideryTechnique: 'confirmed',
      stitchedBlouse: 'confirmed',
      description: 'draft',
      inclusions: 'draft',
      extraUnstitchedBlousePiece: 'unconfirmed',
      stock: 'unconfirmed',
      care: 'unconfirmed',
      tiktok: 'unconfirmed',
    },
    openQuestions: [
      'Is any additional unstitched blouse fabric included? (not stated; not shown on the site)',
    ],
  },
  {
    sku: 'KS-004',
    slug: KS004,
    title: 'Cream & Red-Gold Soft Art Silk Saree',
    shortTitle: 'Cream & Red-Gold Art Silk Saree',
    priceAud: 85,
    fabric: 'Soft art silk',
    colour: 'Cream / champagne gold with vibrant red and gold border',
    work: 'Fine all-over woven-look geometric and floral pattern, broad red-and-gold ornamental border, richly patterned red pallu and red tassels',
    shortDescription:
      'Elegant champagne-cream art silk meets a rich red-and-gold border and tasselled pallu for a timeless festive look.',
    description:
      'A timeless festive classic in cream, red and shimmering gold. This soft art silk saree features delicate woven-look patterns across the light champagne body, contrasted with a vivid red border featuring ornate gold floral and geometric motifs. The richly patterned red pallu ends in decorative tassels and adds a graceful finishing touch. Beautiful for traditional celebrations, family events and festive gatherings. Includes an unstitched blouse piece, with fall and hem already completed. Petticoat not included.',
    highlights: [
      'Soft art silk with a champagne-cream body',
      'Detailed all-over woven-look motifs',
      'Statement red border with shimmering gold patterning',
      'Decorative red-and-gold pallu with tassels',
      'Unstitched blouse piece included; fall and hem completed',
    ],
    blouse: 'Unstitched blouse piece included',
    petticoat: 'Not included',
    sizeAlteration: 'Unstitched blouse piece (no stitched blouse size)',
    included: ['Unstitched blouse piece', 'Fall and hem completed'],
    notIncluded: ['Petticoat not included'],
    tags: ['cream saree', 'red border saree', 'gold saree', 'art silk', 'traditional', 'festive'],
    gallery: [
      { src: P(KS004, '01_front_drape.jpeg'), ...PORTRAIT, role: 'Front drape', alt: 'Cream & Red-Gold Art Silk Saree, front drape' },
      { src: P(KS004, '02_lower_drape.jpeg'), ...PORTRAIT, role: 'Lower drape', alt: 'Cream & Red-Gold Art Silk Saree, lower drape' },
      { src: P(KS004, '03_pallu_detail.jpeg'), ...PORTRAIT, role: 'Pallu detail', alt: 'Cream & Red-Gold Art Silk Saree, pallu detail' },
      { src: P(KS004, '04_pallu_tassels.jpeg'), ...PORTRAIT, role: 'Pallu tassels', alt: 'Cream & Red-Gold Art Silk Saree, pallu tassels' },
    ],
    initialStock: 1,
    tiktokProductVideoUrl: null,
    collections: [],
    status: {
      price: 'draft',
      fabric: 'confirmed',
      description: 'draft',
      inclusions: 'draft',
      stock: 'unconfirmed',
      care: 'unconfirmed',
      tiktok: 'unconfirmed',
      photos: 'unconfirmed',
    },
    openQuestions: [
      'Photo sets for KS-002 and KS-004 were swapped in the pack; confirm the cream/red-gold photos belong to KS-004 at AUD 85.',
    ],
  },
  {
    sku: 'KS-005',
    slug: KS005,
    title: 'Red Bandhani-Style Georgette Saree with Embroidery',
    shortTitle: 'Red Bandhani-Style Georgette Saree',
    priceAud: 80,
    fabric: 'Georgette',
    colour: 'Vibrant ruby red with orange, pink and light motifs, champagne/silver-gold-tone embroidery',
    work: 'Bandhani-inspired dotted paisley print and ornate metallic-toned floral and paisley embroidered edging',
    shortDescription:
      'Vibrant red georgette meets playful Bandhani-inspired paisley patterns and intricate metallic floral embroidery.',
    description:
      'Vibrant, expressive and full of festive charm, this red georgette saree balances traditional Bandhani-inspired dotted paisley motifs in orange and soft pink with ornate metallic-toned floral and paisley embroidery. The elaborate edging frames the light, flowing fabric, creating a striking look for celebrations, cultural events and special gatherings. Includes an unstitched blouse piece, with fall and hem completed. Petticoat not included.',
    highlights: [
      'Bright ruby-red flowing georgette',
      'Bandhani-inspired dotted paisley and curved motifs',
      'Detailed metallic-tone embroidered floral and paisley border',
      'Unstitched blouse piece included; fall and hem completed',
    ],
    blouse: 'Unstitched blouse piece included',
    petticoat: 'Not included',
    sizeAlteration: 'Unstitched blouse piece (no stitched blouse size)',
    included: ['Unstitched blouse piece', 'Fall and hem completed'],
    notIncluded: ['Petticoat not included'],
    tags: ['red georgette saree', 'Bandhani-inspired', 'paisley', 'embroidered border', 'festive', 'occasionwear'],
    gallery: [
      { src: P(KS005, '01_front_drape.jpeg'), ...PORTRAIT, role: 'Front drape', alt: 'Red Bandhani-Style Georgette Saree, front drape' },
      { src: P(KS005, '02_lower_drape.jpeg'), ...PORTRAIT, role: 'Lower drape', alt: 'Red Bandhani-Style Georgette Saree, lower drape' },
      { src: P(KS005, '03_front_alternate.jpeg'), ...PORTRAIT, role: 'Front alternate', alt: 'Red Bandhani-Style Georgette Saree, front alternate' },
      { src: P(KS005, '04_folded_saree_and_blouse.jpeg'), ...PORTRAIT, role: 'Folded saree and blouse', alt: 'Red Bandhani-Style Georgette Saree, folded saree and blouse' },
    ],
    initialStock: 1,
    tiktokProductVideoUrl: null,
    collections: [],
    status: {
      price: 'draft',
      fabric: 'confirmed',
      inclusions: 'confirmed',
      description: 'draft',
      stock: 'unconfirmed',
      care: 'unconfirmed',
      tiktok: 'unconfirmed',
    },
    openQuestions: [],
  },
];

/** Care guidance has not been supplied by the owner yet (catalog: shared_care_instructions). */
export const CARE_PLACEHOLDER =
  'Care guidance for this saree is being confirmed and will be added here. Please contact us before washing or treating the fabric.';

export function getProductBySlug(slug: string): CatalogProduct | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductBySku(sku: string): CatalogProduct | undefined {
  return PRODUCTS.find((p) => p.sku === sku);
}

export const FABRIC_FILTERS = Array.from(new Set(PRODUCTS.map((p) => p.fabric)));
