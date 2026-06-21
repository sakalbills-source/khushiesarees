export type Category = 'saree' | 'lehenga' | 'suit' | 'kurti' | 'mens';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number; // in INR (₹)
  images: string[];
  category: Category;
  fabric: string;
  size_guide: string;
  in_stock: boolean;
}

export interface CartItem {
  product_id: string;
  sku: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customization?: string;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped';

export interface Order {
  id: string;
  user_email: string;
  shipping_country: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  created_at: string;
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'saree', label: 'Saree' },
  { value: 'lehenga', label: 'Lehenga' },
  { value: 'suit', label: 'Salwar Suits' },
  { value: 'kurti', label: 'Kurti' },
  { value: 'mens', label: 'Mens' },
];

export const FABRICS = [
  'Silk',
  'Cotton',
  'Georgette',
  'Chiffon',
  'Banarasi',
  'Linen',
  'Net',
  'Velvet',
];
