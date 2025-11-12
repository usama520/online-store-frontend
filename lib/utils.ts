/**
 * Format price with currency symbol
 * @param price - The price value
 * @param currencySymbol - The currency symbol (default: Rs.)
 * @returns Formatted price string with symbol before the amount (e.g., "Rs. 540")
 */
export function formatPrice(price: number, currencySymbol: string = 'Rs.'): string {
  return `${currencySymbol} ${price.toFixed(2)}`;
}

