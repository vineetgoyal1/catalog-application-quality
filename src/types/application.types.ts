// Base entity from LeanIX
export interface Application {
  id: string;
  displayName: string;
  description: string | null;
  siId: string | null;
  provider: string | null;
  providerExternalId: string | null;
}

// Enhanced with quality assessment
export interface ApplicationQuality extends Application {
  wordCount: number;
  isGoodDescriptionQuality: boolean;
  hasSiIdQuality: boolean;
  hasProviderQuality: boolean;
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
  overview: {
    perfect: number;
    good: number;
    fair: number;
    needsWork: number;
  };
  totalCount: number;
}
