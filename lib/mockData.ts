import { Product, Category } from './types';

// Curated saree/ethnic-wear imagery from Unsplash (royalty-free).
const IMG = {
  saree: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
    'https://images.unsplash.com/photo-1617059062242-9b1d3a0c0d4b?w=800&q=80',
    'https://images.unsplash.com/photo-1594387303328-3f8df0d3a3ab?w=800&q=80',
  ],
  lehenga: [
    'https://images.unsplash.com/photo-1610189844877-1c5b6c0c2d8e?w=800&q=80',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800&q=80',
  ],
  suit: [
    'https://images.unsplash.com/photo-1603190287605-e6ade32fa852?w=800&q=80',
    'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800&q=80',
    'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80',
  ],
  kurti: [
    'https://images.unsplash.com/photo-1614093302611-8ef9b9d8b8c0?w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80',
  ],
  mens: [
    'https://images.unsplash.com/photo-1622519407650-3df9883f76a5?w=800&q=80',
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
  ],
} as const;

const SIZE_GUIDE = `Blouse: Unstitched (0.8m) | Saree length: 5.5m + 0.8m blouse piece.
Custom stitching available — provide measurements at checkout.
Bust: S 34" / M 36" / L 38" / XL 40" / XXL 42".`;

const SIZE_GUIDE_STITCHED = `Available sizes: XS (32"), S (34"), M (36"), L (38"), XL (40"), XXL (42").
Custom sizing available on request.`;

interface Seed {
  prefix: string;
  category: Category;
  fabrics: string[];
  images: readonly string[];
  basePrice: number;
  names: string[];
  sizeGuide: string;
}

const seeds: Seed[] = [
  {
    prefix: 'SAR',
    category: 'saree',
    fabrics: ['Silk', 'Banarasi', 'Georgette', 'Chiffon', 'Cotton', 'Net'],
    images: IMG.saree,
    basePrice: 3499,
    sizeGuide: SIZE_GUIDE,
    names: [
      'Royal Kanjeevaram Silk Saree',
      'Banarasi Zari Bridal Saree',
      'Pastel Organza Floral Saree',
      'Classic Kanchipuram Temple Border',
      'Embroidered Georgette Party Saree',
      'Handloom Cotton Daily Wear Saree',
      'Sequin Net Designer Saree',
      'Pure Tussar Silk Saree',
      'Maroon Patola Wedding Saree',
      'Ivory Chiffon Embellished Saree',
    ],
  },
  {
    prefix: 'LEH',
    category: 'lehenga',
    fabrics: ['Velvet', 'Net', 'Silk', 'Georgette'],
    images: IMG.lehenga,
    basePrice: 8999,
    sizeGuide: SIZE_GUIDE_STITCHED,
    names: [
      'Bridal Velvet Lehenga Choli',
      'Sequin Net Reception Lehenga',
      'Pastel Floral Sangeet Lehenga',
      'Royal Red Embroidered Lehenga',
      'Mirror Work Festive Lehenga',
      'Pista Green Silk Lehenga',
      'Golden Zardozi Bridal Lehenga',
      'Wine Velvet Designer Lehenga',
    ],
  },
  {
    prefix: 'SUT',
    category: 'suit',
    fabrics: ['Cotton', 'Georgette', 'Silk', 'Linen'],
    images: IMG.suit,
    basePrice: 2799,
    sizeGuide: SIZE_GUIDE_STITCHED,
    names: [
      'Anarkali Embroidered Suit Set',
      'Cotton Printed Palazzo Suit',
      'Silk Sharara Festive Suit',
      'Georgette Straight Cut Suit',
      'Chikankari Lucknowi Suit',
      'Patiala Salwar Suit',
      'Pastel Palazzo Party Suit',
      'Designer Gota Patti Suit',
    ],
  },
  {
    prefix: 'KUR',
    category: 'kurti',
    fabrics: ['Cotton', 'Linen', 'Georgette', 'Silk'],
    images: IMG.kurti,
    basePrice: 1299,
    sizeGuide: SIZE_GUIDE_STITCHED,
    names: [
      'Block Print Cotton Kurti',
      'Embroidered A-Line Kurti',
      'Linen Straight Office Kurti',
      'Floral Anarkali Kurti',
      'Mandarin Collar Silk Kurti',
      'Chikankari Long Kurti',
      'Indigo Printed Cotton Kurti',
      'Designer Kaftan Kurti',
    ],
  },
  {
    prefix: 'MEN',
    category: 'mens',
    fabrics: ['Silk', 'Cotton', 'Linen'],
    images: IMG.mens,
    basePrice: 3999,
    sizeGuide: SIZE_GUIDE_STITCHED,
    names: [
      'Silk Sherwani Wedding Set',
      'Cotton Kurta Pajama Set',
      'Nehru Jacket Kurta Combo',
      'Linen Pathani Suit',
      'Embroidered Festive Kurta',
      'Jodhpuri Bandhgala Suit',
      'Printed Cotton Kurta',
      'Royal Velvet Sherwani',
    ],
  },
];

function buildProducts(): Product[] {
  const products: Product[] = [];
  for (const seed of seeds) {
    seed.names.forEach((name, i) => {
      const n = i + 1;
      const fabric = seed.fabrics[i % seed.fabrics.length];
      const img = seed.images[i % seed.images.length];
      const altImg = seed.images[(i + 1) % seed.images.length];
      const price = seed.basePrice + i * 750;
      products.push({
        id: `${seed.prefix}-${n}`,
        sku: `${seed.prefix}-${String(n).padStart(3, '0')}`,
        name,
        description: `Exquisitely crafted ${name.toLowerCase()} made from premium ${fabric.toLowerCase()}. Featuring intricate detailing and a flattering drape, this piece is perfect for weddings, festivals, and special occasions. Comes with matching accessories where applicable.`,
        price,
        images: [img, altImg],
        category: seed.category,
        fabric,
        size_guide: seed.sizeGuide,
        in_stock: i % 7 !== 6, // occasionally out of stock
      });
    });
  }
  return products;
}

export const MOCK_PRODUCTS: Product[] = buildProducts();
