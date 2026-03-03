/**
 * Check if hostingType is present
 */
export function hasHostingTypeQuality(hostingType: string | null | undefined): boolean {
  return !!(hostingType && hostingType.trim().length > 0);
}
