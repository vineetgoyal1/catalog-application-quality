import { lx } from '@leanix/reporting';
import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { DrillDownModal } from './components/DrillDownModal';
import { ExecutiveOverviewModal } from './components/ExecutiveOverviewModal';
import { OverviewCards } from './components/OverviewCards';
import { QualityProgressBar } from './components/QualityProgressBar';
import type { Application, QualityMetrics } from './types/application.types';
import { assessApplicationQuality } from './utils/assessQuality';
import { fetchAllApplications } from './utils/fetchApplications';

function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
  const [isSiidModalOpen, setIsSiidModalOpen] = useState(false);
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [isWebpageUrlModalOpen, setIsWebpageUrlModalOpen] = useState(false);
  const [isApplicationSubTypeModalOpen, setIsApplicationSubTypeModalOpen] = useState(false);
  const [isPricingTypeModalOpen, setIsPricingTypeModalOpen] = useState(false);
  const [isHostingTypeModalOpen, setIsHostingTypeModalOpen] = useState(false);
  const [isITComponentModalOpen, setIsITComponentModalOpen] = useState(false);
  const [isITComponentActiveDateModalOpen, setIsITComponentActiveDateModalOpen] = useState(false);
  const [executiveOverviewTier, setExecutiveOverviewTier] = useState<'perfect' | 'good' | 'fair' | 'needsWork' | null>(null);
  const [workspaceHost, setWorkspaceHost] = useState<string>('');

  useEffect(() => {
    const initAndFetchData = async () => {
      try {
        // 1. Initialize SDK
        const setup = await lx.init();

        // Get workspace host for inventory links
        const host = setup.settings.baseUrl.replace('https://', '');
        setWorkspaceHost(host);

        // 2. Configure report (minimal config)
        lx.ready({});

        // 3. Show UI immediately
        setLoading(false);
        setIsDataLoading(true);

        // 4. Fetch data progressively
        const data = await fetchAllApplications((_page, _total, current, hasMore) => {
          setLoadingProgress(hasMore ? 'Loading more...' : 'Finalizing...');
          // Don't update during pagination - only at the end
        });

        // 5. Final update
        console.log(`Final data loaded: ${data.length} applications`);
        setApplications(data);
        setLoadingProgress('Finalizing...');
        await new Promise(resolve => setTimeout(resolve, 300));

        setIsDataLoading(false);
      } catch (err: any) {
        const errorMsg = err.message || err.toString() || 'Failed to load data';
        console.error('Data loading error:', err);
        setError(errorMsg);
        setLoading(false);
      }
    };

    initAndFetchData();
  }, []);

  const qualityMetrics: QualityMetrics = useMemo(() => {
    if (applications.length === 0) {
      return {
        description: { good: [], needsImprovement: [] },
        siid: { good: [], needsImprovement: [] },
        provider: { good: [], needsImprovement: [] },
        webpageUrl: { good: [], needsImprovement: [] },
        applicationSubType: { good: [], needsImprovement: [] },
        pricingType: { good: [], needsImprovement: [] },
        hostingType: { good: [], needsImprovement: [] },
        itComponent: { good: [], needsImprovement: [] },
        itComponentActiveDate: { good: [], needsImprovement: [] },
        overview: { perfect: 0, good: 0, fair: 0, needsWork: 0 },
        totalCount: 0
      };
    }
    return assessApplicationQuality(applications);
  }, [applications]);

  // Get applications by quality tier for Executive Overview modal
  const tierApplications = useMemo(() => {
    if (applications.length === 0) {
      return { perfect: [], good: [], fair: [], needsWork: [] };
    }

    // Reuse the already-assessed apps from qualityMetrics instead of re-calculating
    const allAssessed = qualityMetrics.description.good.concat(qualityMetrics.description.needsImprovement);

    const tiers = {
      perfect: [] as typeof allAssessed,
      good: [] as typeof allAssessed,
      fair: [] as typeof allAssessed,
      needsWork: [] as typeof allAssessed
    };

    allAssessed.forEach(app => {
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

      if (factorsPassed === 9) tiers.perfect.push(app);
      else if (factorsPassed === 8) tiers.good.push(app);
      else if (factorsPassed === 7) tiers.fair.push(app);
      else tiers.needsWork.push(app);
    });

    return tiers;
  }, [qualityMetrics]);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <main className="app__main">
        <OverviewCards
          perfect={qualityMetrics.overview.perfect}
          good={qualityMetrics.overview.good}
          fair={qualityMetrics.overview.fair}
          needsWork={qualityMetrics.overview.needsWork}
          totalCount={qualityMetrics.totalCount}
          onClickPerfect={() => setExecutiveOverviewTier('perfect')}
          onClickGood={() => setExecutiveOverviewTier('good')}
          onClickFair={() => setExecutiveOverviewTier('fair')}
          onClickNeedsWork={() => setExecutiveOverviewTier('needsWork')}
          isLoading={isDataLoading}
          loadingProgress={loadingProgress}
        />

        <div className="quality-cards-container">
        <QualityProgressBar
          title="Description Quality"
          subtitle="Application descriptions (>20 words)"
          goodLabel="Good quality"
          needsImprovementLabel="Can improve"
          goodCount={qualityMetrics.description.good.length}
          needsImprovementCount={qualityMetrics.description.needsImprovement.length}
          onClickNeedsImprovement={() => setIsDescriptionModalOpen(true)}
        />

        <QualityProgressBar
          title="SIID Presence"
          subtitle="SIID defined for Application Logos"
          goodLabel="SIID present"
          needsImprovementLabel="SIID missing"
          goodCount={qualityMetrics.siid.good.length}
          needsImprovementCount={qualityMetrics.siid.needsImprovement.length}
          onClickNeedsImprovement={() => setIsSiidModalOpen(true)}
        />

        <QualityProgressBar
          title="Provider Information"
          subtitle="Provider and Provider External ID defined"
          goodLabel="Both present"
          needsImprovementLabel="Missing data"
          goodCount={qualityMetrics.provider.good.length}
          needsImprovementCount={qualityMetrics.provider.needsImprovement.length}
          onClickNeedsImprovement={() => setIsProviderModalOpen(true)}
        />

        <QualityProgressBar
          title="Webpage URL"
          subtitle="Webpage URL defined"
          goodLabel="URL present"
          needsImprovementLabel="URL missing"
          goodCount={qualityMetrics.webpageUrl.good.length}
          needsImprovementCount={qualityMetrics.webpageUrl.needsImprovement.length}
          onClickNeedsImprovement={() => setIsWebpageUrlModalOpen(true)}
        />

        <QualityProgressBar
          title="Application Subtype"
          subtitle="Set as Business Application"
          goodLabel="Business Application"
          needsImprovementLabel="Other value"
          goodCount={qualityMetrics.applicationSubType.good.length}
          needsImprovementCount={qualityMetrics.applicationSubType.needsImprovement.length}
          onClickNeedsImprovement={() => setIsApplicationSubTypeModalOpen(true)}
        />

        <QualityProgressBar
          title="Pricing Type"
          subtitle="Pricing Type defined"
          goodLabel="Present"
          needsImprovementLabel="Missing"
          goodCount={qualityMetrics.pricingType.good.length}
          needsImprovementCount={qualityMetrics.pricingType.needsImprovement.length}
          onClickNeedsImprovement={() => setIsPricingTypeModalOpen(true)}
        />

        <QualityProgressBar
          title="Hosting Type"
          subtitle="Hosting Type defined"
          goodLabel="Present"
          needsImprovementLabel="Missing"
          goodCount={qualityMetrics.hostingType.good.length}
          needsImprovementCount={qualityMetrics.hostingType.needsImprovement.length}
          onClickNeedsImprovement={() => setIsHostingTypeModalOpen(true)}
        />

        <QualityProgressBar
          title="IT Component Relation"
          subtitle="Related to valid IT Component"
          goodLabel="Has relation"
          needsImprovementLabel="No valid relation"
          goodCount={qualityMetrics.itComponent.good.length}
          needsImprovementCount={qualityMetrics.itComponent.needsImprovement.length}
          onClickNeedsImprovement={() => setIsITComponentModalOpen(true)}
        />

        <QualityProgressBar
          title="Active Dates for IT Component"
          subtitle="Valid IT Components have active date set"
          goodLabel="Has dates"
          needsImprovementLabel="Missing dates"
          goodCount={qualityMetrics.itComponentActiveDate.good.length}
          needsImprovementCount={qualityMetrics.itComponentActiveDate.needsImprovement.length}
          onClickNeedsImprovement={() => setIsITComponentActiveDateModalOpen(true)}
        />
        </div>
      </main>

      <DrillDownModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        applications={qualityMetrics.description.needsImprovement}
        title="Applications with Poor Descriptions"
        subtitle={`${qualityMetrics.description.needsImprovement.length} applications with ≤20 words`}
        mode="description"
        workspaceHost={workspaceHost}
      />

      <DrillDownModal
        isOpen={isSiidModalOpen}
        onClose={() => setIsSiidModalOpen(false)}
        applications={qualityMetrics.siid.needsImprovement}
        title="Applications Missing SIID"
        subtitle={`${qualityMetrics.siid.needsImprovement.length} applications without System ID`}
        mode="siid"
        workspaceHost={workspaceHost}
      />

      <DrillDownModal
        isOpen={isProviderModalOpen}
        onClose={() => setIsProviderModalOpen(false)}
        applications={qualityMetrics.provider.needsImprovement}
        title="Applications Missing Provider Information"
        subtitle={`${qualityMetrics.provider.needsImprovement.length} applications missing Provider and/or Provider External ID`}
        mode="provider"
        workspaceHost={workspaceHost}
      />

      <DrillDownModal
        isOpen={isWebpageUrlModalOpen}
        onClose={() => setIsWebpageUrlModalOpen(false)}
        applications={qualityMetrics.webpageUrl.needsImprovement}
        title="Applications Missing Webpage URL"
        subtitle={`${qualityMetrics.webpageUrl.needsImprovement.length} applications without webpage URL`}
        mode="webpageUrl"
        workspaceHost={workspaceHost}
      />

      <DrillDownModal
        isOpen={isApplicationSubTypeModalOpen}
        onClose={() => setIsApplicationSubTypeModalOpen(false)}
        applications={qualityMetrics.applicationSubType.needsImprovement}
        title="Applications Not Categorized as businessApplication"
        subtitle={`${qualityMetrics.applicationSubType.needsImprovement.length} applications with missing or different category`}
        mode="applicationSubType"
        workspaceHost={workspaceHost}
      />

      <DrillDownModal
        isOpen={isPricingTypeModalOpen}
        onClose={() => setIsPricingTypeModalOpen(false)}
        applications={qualityMetrics.pricingType.needsImprovement}
        title="Applications Missing Pricing Type"
        subtitle={`${qualityMetrics.pricingType.needsImprovement.length} applications without pricing type`}
        mode="pricingType"
        workspaceHost={workspaceHost}
      />

      <DrillDownModal
        isOpen={isHostingTypeModalOpen}
        onClose={() => setIsHostingTypeModalOpen(false)}
        applications={qualityMetrics.hostingType.needsImprovement}
        title="Applications Missing Hosting Type"
        subtitle={`${qualityMetrics.hostingType.needsImprovement.length} applications without hosting type`}
        mode="hostingType"
        workspaceHost={workspaceHost}
      />

      <DrillDownModal
        isOpen={isITComponentModalOpen}
        onClose={() => setIsITComponentModalOpen(false)}
        applications={qualityMetrics.itComponent.needsImprovement}
        title="Applications Without Valid IT Component Relation"
        subtitle={`${qualityMetrics.itComponent.needsImprovement.length} applications without valid IT Component relation`}
        mode="itComponent"
        workspaceHost={workspaceHost}
      />

      <DrillDownModal
        isOpen={isITComponentActiveDateModalOpen}
        onClose={() => setIsITComponentActiveDateModalOpen(false)}
        applications={qualityMetrics.itComponentActiveDate.needsImprovement}
        title="Applications with IT Components Missing Active Dates"
        subtitle={`${qualityMetrics.itComponentActiveDate.needsImprovement.length} applications where valid IT Components lack active dates`}
        mode="itComponentActiveDate"
        workspaceHost={workspaceHost}
      />

      {executiveOverviewTier && (
        <ExecutiveOverviewModal
          isOpen={true}
          onClose={() => setExecutiveOverviewTier(null)}
          applications={tierApplications[executiveOverviewTier]}
          tier={executiveOverviewTier}
        />
      )}
    </div>
  );
}

export default App;
