import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ApplicationQuality } from '../types/application.types';
import { SimpleModal } from './ui/SimpleModal';
import './ExecutiveOverviewModal.css';

interface ExecutiveOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: ApplicationQuality[];
  tier: 'perfect' | 'good' | 'fair' | 'needsWork';
}

const TIER_CONFIG = {
  perfect: {
    title: 'Perfect Quality Applications',
    subtitle: 'All 9 factors met',
  },
  good: {
    title: 'Good Quality Applications',
    subtitle: 'Lacking 1 factor',
  },
  fair: {
    title: 'Fair Quality Applications',
    subtitle: 'Lacking 2 factors',
  },
  needsWork: {
    title: 'Needs Work Applications',
    subtitle: 'Lacking 3-9 factors',
  },
};

const QUALITY_FACTORS = [
  { key: 'isGoodDescriptionQuality', label: 'Desc', tooltip: 'Description Quality (4 factors: Word count ≥20, Functional verbs, Target users, App identity)' },
  { key: 'hasSiIdQuality', label: 'SIID', tooltip: 'SIID Presence' },
  { key: 'hasProviderQuality', label: 'Provider', tooltip: 'Provider Information' },
  { key: 'hasWebpageUrlQuality', label: 'URL', tooltip: 'Webpage URL' },
  { key: 'hasApplicationSubTypeQuality', label: 'Subtype', tooltip: 'Application Subtype' },
  { key: 'hasPricingTypeQuality', label: 'Pricing', tooltip: 'Pricing Type' },
  { key: 'hasHostingTypeQuality', label: 'Hosting', tooltip: 'Hosting Type' },
  { key: 'hasITComponentQuality', label: 'IT Comp', tooltip: 'IT Component Relation' },
  { key: 'hasITComponentActiveDateQuality', label: 'Active Date', tooltip: 'Active Dates for IT Component' },
];

const INITIAL_LOAD = 50;
const LOAD_MORE_THRESHOLD = 200; // Load more when 200px from bottom

export function ExecutiveOverviewModal({
  isOpen,
  onClose,
  applications,
  tier,
}: ExecutiveOverviewModalProps) {
  const [displayCount, setDisplayCount] = useState(INITIAL_LOAD);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const config = TIER_CONFIG[tier];
  const displayedApps = useMemo(
    () => applications.slice(0, displayCount),
    [applications, displayCount]
  );

  // Reset display count and scroll position when modal opens
  useEffect(() => {
    if (isOpen) {
      setDisplayCount(INITIAL_LOAD);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // Handle scroll for lazy loading with proper cleanup
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

      if (distanceFromBottom < LOAD_MORE_THRESHOLD && displayCount < applications.length) {
        setDisplayCount((prev) => Math.min(prev + INITIAL_LOAD, applications.length));
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [displayCount, applications.length]);

  // Truncate application name
  const truncateName = useCallback((name: string, maxLength: number = 12) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  }, []);

  // Handle empty state
  if (applications.length === 0) {
    return (
      <SimpleModal
        isOpen={isOpen}
        onClose={onClose}
        title={`${config.title} (0)`}
        subtitle={config.subtitle}
      >
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          No applications in this quality tier
        </div>
      </SimpleModal>
    );
  }

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${config.title} (${applications.length.toLocaleString()})`}
      subtitle={config.subtitle}
    >
      <div className="executive-overview-count">
        Showing {displayedApps.length} of {applications.length} applications
      </div>

      <div
        ref={scrollContainerRef}
        className="executive-overview-table-container"
      >
        <table className="executive-overview-table">
          <thead>
            <tr>
              <th className="app-name-col">Application</th>
              {QUALITY_FACTORS.map((factor) => (
                <th key={factor.key} className="factor-col" title={factor.tooltip}>
                  {factor.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedApps.map((app) => (
              <tr key={app.id}>
                <td className="app-name-cell" title={app.displayName}>
                  {truncateName(app.displayName)}
                </td>
                {QUALITY_FACTORS.map((factor) => {
                  const passes = app[factor.key as keyof ApplicationQuality] as boolean;
                  return (
                    <td key={factor.key} className="factor-cell">
                      {passes ? (
                        <span className="check-icon" title="Meets quality">✓</span>
                      ) : (
                        <span className="cross-icon" title="Needs improvement">✗</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {displayCount < applications.length && (
          <div className="loading-indicator">
            Scroll down to load more ({(applications.length - displayCount).toLocaleString()} remaining)
          </div>
        )}
      </div>
    </SimpleModal>
  );
}
