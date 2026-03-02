import type { Application, ApplicationQuality, QualityMetrics } from '../types/application.types';
import { hasProviderQuality } from './providerCheck';
import { hasSiId } from './siidCheck';
import { countWords, isGoodDescriptionQuality } from './wordCount';

/**
 * Assess quality of applications and return structured metrics
 */
export function assessApplicationQuality(applications: Application[]): QualityMetrics {
  // 1. Assess each application
  const assessed: ApplicationQuality[] = applications.map(app => ({
    ...app,
    wordCount: countWords(app.description),
    isGoodDescriptionQuality: isGoodDescriptionQuality(app.description),
    hasSiIdQuality: hasSiId(app.siId),
    hasProviderQuality: hasProviderQuality(app.provider, app.providerExternalId)
  }));

  // 2. Separate by quality - Description
  const descriptionGood = assessed.filter(app => app.isGoodDescriptionQuality);
  const descriptionNeedsImprovement = assessed.filter(app => !app.isGoodDescriptionQuality);

  // 3. Separate by quality - SIID
  const siidGood = assessed.filter(app => app.hasSiIdQuality);
  const siidNeedsImprovement = assessed.filter(app => !app.hasSiIdQuality);

  // 4. Separate by quality - Provider
  const providerGood = assessed.filter(app => app.hasProviderQuality);
  const providerNeedsImprovement = assessed.filter(app => !app.hasProviderQuality);

  // 5. Calculate overall quality distribution (3 factors)
  const overview = assessed.reduce((acc, app) => {
    const factorsPassed = [
      app.isGoodDescriptionQuality,
      app.hasSiIdQuality,
      app.hasProviderQuality
    ].filter(Boolean).length;

    if (factorsPassed === 3) acc.perfect++;
    else if (factorsPassed === 2) acc.good++;
    else if (factorsPassed === 1) acc.fair++;
    else acc.needsWork++;

    return acc;
  }, { perfect: 0, good: 0, fair: 0, needsWork: 0 });

  // 6. Return structured metrics
  return {
    description: {
      good: descriptionGood,
      needsImprovement: descriptionNeedsImprovement
    },
    siid: {
      good: siidGood,
      needsImprovement: siidNeedsImprovement
    },
    provider: {
      good: providerGood,
      needsImprovement: providerNeedsImprovement
    },
    overview,
    totalCount: applications.length
  };
}
