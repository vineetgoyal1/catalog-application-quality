// Base entity from LeanIX
export interface Application {
  id: string;
  displayName: string;
  description: string | null;
  siId: string | null;
  provider: string | null;
  providerExternalId: string | null;
  webpageUrl: string | null;
  category: string | null;
  pricingType: string | null;
  hostingType: string | null;
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
  }> | null;
}

// Enhanced with quality assessment
export interface ApplicationQuality extends Application {
  wordCount: number;
  isGoodDescriptionQuality: boolean;
  hasSiIdQuality: boolean;
  hasProviderQuality: boolean;
  hasWebpageUrlQuality: boolean;
  hasApplicationSubTypeQuality: boolean;
  hasPricingTypeQuality: boolean;
  hasHostingTypeQuality: boolean;
  hasITComponentQuality: boolean;
  hasITComponentActiveDateQuality: boolean;
}

// Aggregated metrics for UI
export interface QualityMetrics {
  description: {
    good: ApplicationQuality[];
    needsImprovement: ApplicationQuality[];
  };
  siid: {
    good: ApplicationQuality[];
    needsImprovement: ApplicationQuality[];
  };
  provider: {
    good: ApplicationQuality[];
    needsImprovement: ApplicationQuality[];
  };
  webpageUrl: {
    good: ApplicationQuality[];
    needsImprovement: ApplicationQuality[];
  };
  applicationSubType: {
    good: ApplicationQuality[];
    needsImprovement: ApplicationQuality[];
  };
  pricingType: {
    good: ApplicationQuality[];
    needsImprovement: ApplicationQuality[];
  };
  hostingType: {
    good: ApplicationQuality[];
    needsImprovement: ApplicationQuality[];
  };
  itComponent: {
    good: ApplicationQuality[];
    needsImprovement: ApplicationQuality[];
  };
  itComponentActiveDate: {
    good: ApplicationQuality[];
    needsImprovement: ApplicationQuality[];
  };
  overview: {
    perfect: number;
    good: number;
    fair: number;
    needsWork: number;
  };
  totalCount: number;
}
