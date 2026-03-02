/**
 * Check if both provider and providerExternalId are present
 * Both fields must be non-null and non-empty for good quality
 */
export function hasProviderQuality(
  provider: string | null | undefined,
  providerExternalId: string | null | undefined
): boolean {
  const hasProvider = !!(provider && provider.trim().length > 0);
  const hasProviderExternalId = !!(providerExternalId && providerExternalId.trim().length > 0);

  // Both must be present
  return hasProvider && hasProviderExternalId;
}
