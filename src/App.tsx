import { lx } from '@leanix/reporting';
import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { DrillDownModal } from './components/DrillDownModal';
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
  const [overviewModalLevel, setOverviewModalLevel] = useState<'perfect' | 'good' | 'fair' | 'needsWork' | null>(null);
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
          setApplications(current);
        });

        // 5. Final update
        setApplications(data);
        setLoadingProgress('Finalizing...');
        await new Promise(resolve => setTimeout(resolve, 300));

        setIsDataLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
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
        overview: { perfect: 0, good: 0, fair: 0, needsWork: 0 },
        totalCount: 0
      };
    }
    return assessApplicationQuality(applications);
  }, [applications]);

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
          onClickPerfect={() => setOverviewModalLevel('perfect')}
          onClickGood={() => setOverviewModalLevel('good')}
          onClickFair={() => setOverviewModalLevel('fair')}
          onClickNeedsWork={() => setOverviewModalLevel('needsWork')}
          isLoading={isDataLoading}
          loadingProgress={loadingProgress}
        />

        <div className="quality-cards-container">
        <QualityProgressBar
          title="Description Quality"
          subtitle="Application descriptions (>30 words)"
          goodLabel="Good quality"
          needsImprovementLabel="Needs improvement"
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
        </div>
      </main>

      <DrillDownModal
        isOpen={isDescriptionModalOpen}
        onClose={() => setIsDescriptionModalOpen(false)}
        applications={qualityMetrics.description.needsImprovement}
        title="Applications with Poor Descriptions"
        subtitle={`${qualityMetrics.description.needsImprovement.length} applications with ≤30 words`}
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
    </div>
  );
}

export default App;
