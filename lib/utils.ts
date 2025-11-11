/**
 * Format price with currency symbol
 * @param price - The price value
 * @param currencySymbol - The currency symbol (default: ₨)
 * @returns Formatted price string with symbol before the amount
 */
export function formatPrice(price: number, currencySymbol: string = '₨'): string {
  return `${currencySymbol}${price.toFixed(2)}`;
}

