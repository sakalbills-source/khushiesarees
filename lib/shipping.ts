export interface ShippingRegion {
  code: string;
  label: string;
  rate: number; // flat rate in AUD (the canonical base currency)
}

// Fixed flat rates per region, authored in AUD. Converted to the shopper's
// selected currency for display/checkout, same as product prices.
export const SHIPPING_REGIONS: ShippingRegion[] = [
  { code: 'USA', label: 'United States', rate: 35 },
  { code: 'UK', label: 'United Kingdom', rate: 32 },
  { code: 'EU', label: 'Europe (EU)', rate: 34 },
  { code: 'NZ', label: 'New Zealand', rate: 20 },
  { code: 'AU', label: 'Australia', rate: 12 },
  { code: 'FJ', label: 'Fiji', rate: 28 },
  { code: 'CARIB', label: 'Caribbean', rate: 45 },
];

export function getShippingRate(code: string): number {
  return SHIPPING_REGIONS.find((r) => r.code === code)?.rate ?? 0;
}

export function getRegion(code: string): ShippingRegion | undefined {
  return SHIPPING_REGIONS.find((r) => r.code === code);
}
