/**
 * Check if siId is present
 */
export function hasSiId(siId: string | null | undefined): boolean {
  return !!(siId && siId.trim().length > 0);
}
