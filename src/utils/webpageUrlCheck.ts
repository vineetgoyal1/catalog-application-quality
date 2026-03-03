/**
 * Check if webpageUrl is present
 */
export function hasWebpageUrlQuality(webpageUrl: string | null | undefined): boolean {
  return !!(webpageUrl && webpageUrl.trim().length > 0);
}
