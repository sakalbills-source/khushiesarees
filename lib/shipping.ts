export interface ShippingRegion {
  code: string;
  label: string;
  rate: number; // flat rate in INR (₹)
}

// Fixed flat rates per region, calculated at checkout.
export const SHIPPING_REGIONS: ShippingRegion[] = [
  { code: 'USA', label: 'United States', rate: 2500 },
  { code: 'UK', label: 'United Kingdom', rate: 2200 },
  { code: 'EU', label: 'Europe (EU)', rate: 2400 },
  { code: 'NZ', label: 'New Zealand', rate: 2800 },
  { code: 'AU', label: 'Australia', rate: 2700 },
  { code: 'FJ', label: 'Fiji', rate: 3000 },
  { code: 'CARIB', label: 'Caribbean', rate: 3200 },
];

export function getShippingRate(code: string): number {
  return SHIPPING_REGIONS.find((r) => r.code === code)?.rate ?? 0;
}

export function getRegion(code: string): ShippingRegion | undefined {
  return SHIPPING_REGIONS.find((r) => r.code === code);
}
