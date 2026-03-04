import type { Application, ApplicationQuality, QualityMetrics } from '../types/application.types';
import { hasApplicationSubTypeQuality } from './categoryCheck';
import { assessDescriptionQuality } from './descriptionQuality';
import { hasHostingTypeQuality } from './hostingTypeCheck';
import { hasITComponentQuality } from './itComponentCheck';
import { hasITComponentActiveDateQuality } from './itComponentActiveDateCheck';
import { hasPricingTypeQuality } from './pricingTypeCheck';
import { hasProviderQuality } from './providerCheck';
import { hasSiId } from './siidCheck';
import { hasWebpageUrlQuality } from './webpageUrlCheck';
import { countWords } from './wordCount';

/**
 * Assess quality of applications and return structured metrics
 *
 * Performance optimized: Single pass through data to populate all categories
 */
export function assessApplicationQuality(applications: Application[]): QualityMetrics {
  // Initialize result structure
  const descriptionGood: ApplicationQuality[] = [];
  const descriptionNeedsImprovement: ApplicationQuality[] = [];
  const siidGood: ApplicationQuality[] = [];
  const siidNeedsImprovement: ApplicationQuality[] = [];
  const providerGood: ApplicationQuality[] = [];
  const providerNeedsImprovement: ApplicationQuality[] = [];
  const webpageUrlGood: ApplicationQuality[] = [];
  const webpageUrlNeedsImprovement: ApplicationQuality[] = [];
  const applicationSubTypeGood: ApplicationQuality[] = [];
  const applicationSubTypeNeedsImprovement: ApplicationQuality[] = [];
  const pricingTypeGood: ApplicationQuality[] = [];
  const pricingTypeNeedsImprovement: ApplicationQuality[] = [];
  const hostingTypeGood: ApplicationQuality[] = [];
  const hostingTypeNeedsImprovement: ApplicationQuality[] = [];
  const itComponentGood: ApplicationQuality[] = [];
  const itComponentNeedsImprovement: ApplicationQuality[] = [];
  const itComponentActiveDateGood: ApplicationQuality[] = [];
  const itComponentActiveDateNeedsImprovement: ApplicationQuality[] = [];

  const overview = { perfect: 0, good: 0, fair: 0, needsWork: 0 };

  // Single pass: assess each application and categorize in one iteration
  applications.forEach(app => {
    // Assess description quality with 4 factors
    const descQuality = assessDescriptionQuality(app.description);

    const assessed: ApplicationQuality = {
      ...app,
      wordCount: countWords(app.description),
      isGoodDescriptionQuality: descQuality.isGoodQuality, // All 4 factors must pass
      descriptionQualityDetails: {
        hasMinimumWordCount: descQuality.hasMinimumWordCount,
        hasFunctionalVerbs: descQuality.hasFunctionalVerbs,
        hasTargetUsersOrUseCases: descQuality.hasTargetUsersOrUseCases,
        hasApplicationIdentity: descQuality.hasApplicationIdentity,
        factorsPassed: descQuality.factorsPassed
      },
      hasSiIdQuality: hasSiId(app.siId),
      hasProviderQuality: hasProviderQuality(app.provider, app.providerExternalId),
      hasWebpageUrlQuality: hasWebpageUrlQuality(app.webpageUrl),
      hasApplicationSubTypeQuality: hasApplicationSubTypeQuality(app.category),
      hasPricingTypeQuality: hasPricingTypeQuality(app.pricingType),
      hasHostingTypeQuality: hasHostingTypeQuality(app.hostingType),
      hasITComponentQuality: hasITComponentQuality(app.relITComponentToApplication),
      hasITComponentActiveDateQuality: hasITComponentActiveDateQuality(app.relITComponentToApplication)
    };

    // Categorize into good/needs improvement arrays (avoids 9 separate filter() passes later)
    if (assessed.isGoodDescriptionQuality) descriptionGood.push(assessed);
    else descriptionNeedsImprovement.push(assessed);

    if (assessed.hasSiIdQuality) siidGood.push(assessed);
    else siidNeedsImprovement.push(assessed);

    if (assessed.hasProviderQuality) providerGood.push(assessed);
    else providerNeedsImprovement.push(assessed);

    if (assessed.hasWebpageUrlQuality) webpageUrlGood.push(assessed);
    else webpageUrlNeedsImprovement.push(assessed);

    if (assessed.hasApplicationSubTypeQuality) applicationSubTypeGood.push(assessed);
    else applicationSubTypeNeedsImprovement.push(assessed);

    if (assessed.hasPricingTypeQuality) pricingTypeGood.push(assessed);
    else pricingTypeNeedsImprovement.push(assessed);

    if (assessed.hasHostingTypeQuality) hostingTypeGood.push(assessed);
    else hostingTypeNeedsImprovement.push(assessed);

    if (assessed.hasITComponentQuality) itComponentGood.push(assessed);
    else itComponentNeedsImprovement.push(assessed);

    if (assessed.hasITComponentActiveDateQuality) itComponentActiveDateGood.push(assessed);
    else itComponentActiveDateNeedsImprovement.push(assessed);

    // Calculate overall quality distribution (9 factors)
    const factorsPassed = [
      assessed.isGoodDescriptionQuality,
      assessed.hasSiIdQuality,
      assessed.hasProviderQuality,
      assessed.hasWebpageUrlQuality,
      assessed.hasApplicationSubTypeQuality,
      assessed.hasPricingTypeQuality,
      assessed.hasHostingTypeQuality,
      assessed.hasITComponentQuality,
      assessed.hasITComponentActiveDateQuality
    ].filter(Boolean).length;

    if (factorsPassed === 9) overview.perfect++;
    else if (factorsPassed === 8) overview.good++;
    else if (factorsPassed === 7) overview.fair++;
    else overview.needsWork++; // 6 or fewer factors
  });

  // Return structured metrics
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
