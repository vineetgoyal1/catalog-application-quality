import type { Application, ApplicationQuality, QualityMetrics } from '../types/application.types';
import { hasApplicationSubTypeQuality } from './categoryCheck';
import { hasHostingTypeQuality } from './hostingTypeCheck';
import { hasITComponentQuality } from './itComponentCheck';
import { hasITComponentActiveDateQuality } from './itComponentActiveDateCheck';
import { hasPricingTypeQuality } from './pricingTypeCheck';
import { hasProviderQuality } from './providerCheck';
import { hasSiId } from './siidCheck';
import { hasWebpageUrlQuality } from './webpageUrlCheck';
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
    hasProviderQuality: hasProviderQuality(app.provider, app.providerExternalId),
    hasWebpageUrlQuality: hasWebpageUrlQuality(app.webpageUrl),
    hasApplicationSubTypeQuality: hasApplicationSubTypeQuality(app.category),
    hasPricingTypeQuality: hasPricingTypeQuality(app.pricingType),
    hasHostingTypeQuality: hasHostingTypeQuality(app.hostingType),
    hasITComponentQuality: hasITComponentQuality(app.relITComponentToApplication),
    hasITComponentActiveDateQuality: hasITComponentActiveDateQuality(app.relITComponentToApplication)
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

  // 5. Separate by quality - Webpage URL
  const webpageUrlGood = assessed.filter(app => app.hasWebpageUrlQuality);
  const webpageUrlNeedsImprovement = assessed.filter(app => !app.hasWebpageUrlQuality);

  // 6. Separate by quality - Application Sub Type
  const applicationSubTypeGood = assessed.filter(app => app.hasApplicationSubTypeQuality);
  const applicationSubTypeNeedsImprovement = assessed.filter(app => !app.hasApplicationSubTypeQuality);

  // 7. Separate by quality - Pricing Type
  const pricingTypeGood = assessed.filter(app => app.hasPricingTypeQuality);
  const pricingTypeNeedsImprovement = assessed.filter(app => !app.hasPricingTypeQuality);

  // 8. Separate by quality - Hosting Type
  const hostingTypeGood = assessed.filter(app => app.hasHostingTypeQuality);
  const hostingTypeNeedsImprovement = assessed.filter(app => !app.hasHostingTypeQuality);

  // 9. Separate by quality - IT Component
  const itComponentGood = assessed.filter(app => app.hasITComponentQuality);
  const itComponentNeedsImprovement = assessed.filter(app => !app.hasITComponentQuality);

  // 10. Separate by quality - IT Component Active Date
  const itComponentActiveDateGood = assessed.filter(app => app.hasITComponentActiveDateQuality);
  const itComponentActiveDateNeedsImprovement = assessed.filter(app => !app.hasITComponentActiveDateQuality);

  // 11. Calculate overall quality distribution (9 factors)
  const overview = assessed.reduce((acc, app) => {
    const factorsPassed = [
      app.isGoodDescriptionQuality,
      app.hasSiIdQuality,
      app.hasProviderQuality,
      app.hasWebpageUrlQuality,
      app.hasApplicationSubTypeQuality,
      app.hasPricingTypeQuality,
      app.hasHostingTypeQuality,
      app.hasITComponentQuality,
      app.hasITComponentActiveDateQuality
    ].filter(Boolean).length;

    if (factorsPassed === 9) acc.perfect++;
    else if (factorsPassed === 8) acc.good++;
    else if (factorsPassed === 7) acc.fair++;
    else if (factorsPassed === 5 || factorsPassed === 4 || factorsPassed === 3 || factorsPassed === 2 || factorsPassed === 1) acc.needsWork++;
    else acc.needsWork++;

    return acc;
  }, { perfect: 0, good: 0, fair: 0, needsWork: 0 });

  // 11. Return structured metrics
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
    webpageUrl: {
      good: webpageUrlGood,
      needsImprovement: webpageUrlNeedsImprovement
    },
    applicationSubType: {
      good: applicationSubTypeGood,
      needsImprovement: applicationSubTypeNeedsImprovement
    },
    pricingType: {
      good: pricingTypeGood,
      needsImprovement: pricingTypeNeedsImprovement
    },
    hostingType: {
      good: hostingTypeGood,
      needsImprovement: hostingTypeNeedsImprovement
    },
    itComponent: {
      good: itComponentGood,
      needsImprovement: itComponentNeedsImprovement
    },
    itComponentActiveDate: {
      good: itComponentActiveDateGood,
      needsImprovement: itComponentActiveDateNeedsImprovement
    },
    overview,
    totalCount: applications.length
  };
}
