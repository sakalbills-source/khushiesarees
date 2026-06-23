import { formatMoney } from './currency';

/**
 * Format an amount in the base currency (AUD). Use this only where prices are
 * authored/managed in the base currency (e.g. the admin panel). Customer-facing
 * surfaces should use the currency context (`useCurrency().format`) so prices
 * render in the shopper's selected currency.
 */
export function formatAUD(amount: number): string {
  return formatMoney(amount, 'AUD');
}
