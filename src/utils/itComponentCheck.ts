/**
 * Check if application has at least one valid IT Component relation
 * Valid = IT Component is not deprecated AND has collectionStatus = readyForConsumption
 */
export function hasITComponentQuality(
  relITComponentToApplication: Array<{
    factSheet: {
      deprecated: string | null;
      collectionStatus: string | null;
    };
  }> | null | undefined
): boolean {
  // If no relations at all, return false
  if (!relITComponentToApplication || relITComponentToApplication.length === 0) {
    return false;
  }

  // Check if at least one IT Component is valid (not deprecated AND ready for consumption)
  const hasValidITComponent = relITComponentToApplication.some(relation => {
    const itComponent = relation.factSheet;
    return itComponent.deprecated !== 'Yes' &&
           itComponent.collectionStatus === 'readyForConsumption';
  });

  return hasValidITComponent;
}
