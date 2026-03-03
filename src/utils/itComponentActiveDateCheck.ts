/**
 * Check if all valid IT Components have an "active" phase date set
 *
 * Valid IT Component = deprecated !== 'Yes' AND collectionStatus === 'readyForConsumption'
 *
 * Quality check:
 * - Only applications WITH valid IT Component relations are evaluated
 * - Applications WITHOUT valid IT Component relations are excluded from this check
 * - ALL valid IT Components must have an "active" phase with a non-null startDate
 */
export function hasITComponentActiveDateQuality(
  relITComponentToApplication: Array<{
    factSheet: {
      deprecated: string | null;
      collectionStatus: string | null;
      lifecycle: {
        phases: Array<{
          phase: string;
          startDate: string | null;
        }>;
      } | null;
    };
  }> | null | undefined
): boolean {
  // If no relations at all, exclude from this quality check (return true = not evaluated)
  if (!relITComponentToApplication || relITComponentToApplication.length === 0) {
    return true;
  }

  // Get valid IT Components (not deprecated AND ready for consumption)
  const validITComponents = relITComponentToApplication.filter(relation => {
    const itComponent = relation.factSheet;
    return itComponent.deprecated !== 'Yes' &&
           itComponent.collectionStatus === 'readyForConsumption';
  });

  // If no valid IT Components, exclude from this quality check (return true = not evaluated)
  if (validITComponents.length === 0) {
    return true;
  }

  // Check if ALL valid IT Components have an "active" phase with a non-null startDate
  const allHaveActiveDate = validITComponents.every(relation => {
    const lifecycle = relation.factSheet.lifecycle;

    // If no lifecycle data, fail the check
    if (!lifecycle || !lifecycle.phases || lifecycle.phases.length === 0) {
      return false;
    }

    // Find the "active" phase
    const activePhase = lifecycle.phases.find(p => p.phase === 'active');

    // Check if active phase exists and has a non-null startDate
    return activePhase && activePhase.startDate !== null && activePhase.startDate.trim() !== '';
  });

  return allHaveActiveDate;
}
