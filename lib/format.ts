/** Prices are in Australian dollars, shown as "A$80". */
export function formatAUD(amount: number): string {
  const whole = Number.isInteger(amount);
  return `A$${amount.toLocaleString('en-AU', {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}
