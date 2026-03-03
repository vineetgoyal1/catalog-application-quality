/**
 * Check if pricingType is present
 */
export function hasPricingTypeQuality(pricingType: string | null | undefined): boolean {
  return !!(pricingType && pricingType.trim().length > 0);
}
