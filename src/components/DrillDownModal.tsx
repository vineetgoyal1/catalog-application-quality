import { useMemo, useState } from 'react';
import type { ApplicationQuality } from '../types/application.types';
import { SimpleModal } from './ui/SimpleModal';
import './DrillDownModal.css';

interface DrillDownModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: ApplicationQuality[];
  title: string;
  subtitle: string;
  mode: 'description' | 'siid' | 'provider' | 'webpageUrl' | 'applicationSubType' | 'pricingType' | 'hostingType' | 'itComponent' | 'itComponentActiveDate';
  workspaceHost?: string;
}

export function DrillDownModal({
  isOpen,
  onClose,
  applications,
  title,
  subtitle,
  mode,
  workspaceHost
}: DrillDownModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplications = useMemo(() => {
    if (!searchTerm.trim()) return applications;

    const term = searchTerm.toLowerCase();
    return applications.filter(app =>
      app.displayName.toLowerCase().includes(term)
    );
  }, [applications, searchTerm]);

  // Dynamic subtitle with filtered count
  const dynamicSubtitle = `${filteredApplications.length} of ${applications.length} ${subtitle}`;

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose} title={title} subtitle={dynamicSubtitle}>
      {/* Criteria explanation for description mode */}
      {mode === 'description' && (
        <div className="criteria-explanation">
          <div className="criteria-item">
            <strong>Functional Verbs:</strong> Action words describing what the application does <span className="criteria-examples">(e.g., "allows users to", "tracks projects", "enables teams to")</span>
          </div>
          <div className="criteria-item">
            <strong>Target Users:</strong> Who uses the application or what it's used for <span className="criteria-examples">(e.g., "used by teams", "for project management", "helps developers")</span>
          </div>
          <div className="criteria-item">
            <strong>Application Identity:</strong> Explicitly identifies as a software product <span className="criteria-examples">(e.g., "application", "software", "tool")</span>
          </div>
        </div>
      )}

      <div className="drilldown-search">
        <input
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="drilldown-search-input"
        />
      </div>

      <div className="drilldown-table-container">
        <table className="drilldown-table">
          <thead>
            <tr>
              <th className="app-name-col">Application Name</th>
              {mode === 'description' && (
                <>
                  <th className="description-col">Description</th>
                  <th className="factor-col" title="Word Count (≥20)">Wrds</th>
                  <th className="factor-col" title="Functional Verbs">Vrbs</th>
                  <th className="factor-col" title="Target Users/Use Cases">Usrs</th>
                  <th className="factor-col" title="Application Identity">Ident</th>
                </>
              )}
              {mode === 'siid' && <th>SIID Status</th>}
              {mode === 'provider' && (
                <>
                  <th>Provider</th>
                  <th>Provider External ID</th>
                </>
              )}
              {mode === 'webpageUrl' && <th>Webpage URL Status</th>}
              {mode === 'applicationSubType' && <th>Category</th>}
              {mode === 'pricingType' && <th>Pricing Type</th>}
              {mode === 'hostingType' && <th className="hosting-type-header">Hosting Type</th>}
              {mode === 'itComponent' && <th>IT Component Status</th>}
              {mode === 'itComponentActiveDate' && <th>Active Date Status</th>}
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id}>
                <td className="app-name-col">
                  <div className="app-name-text">
                    {workspaceHost ? (
                      <a
                        href={`https://${workspaceHost}/factsheet/Application/${app.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="app-link"
                        title={app.displayName}
                      >
                        {app.displayName}
                      </a>
                    ) : (
                      <span title={app.displayName}>{app.displayName}</span>
                    )}
                  </div>
                </td>
                {mode === 'description' && (
                  <>
                    <td className="description-col">
                      <div className="description-text" title={app.description || ''}>
                        {app.description || '-'}
                      </div>
                    </td>
                    <td className="factor-col">
                      {app.descriptionQualityDetails?.hasMinimumWordCount ? (
                        <span className="check-icon" title={`${app.wordCount} words`} aria-label={`Passes word count check with ${app.wordCount} words`} role="img">✓</span>
                      ) : (
                        <span className="cross-icon" title={`${app.wordCount} words (need ≥20)`} aria-label={`Fails word count check with ${app.wordCount} words (need 20 or more)`} role="img">✗</span>
                      )}
                    </td>
                    <td className="factor-col">
                      {app.descriptionQualityDetails?.hasFunctionalVerbs ? (
                        <span className="check-icon" title="Has functional verbs" aria-label="Passes functional verbs check" role="img">✓</span>
                      ) : (
                        <span className="cross-icon" title="Missing functional verbs" aria-label="Fails functional verbs check" role="img">✗</span>
                      )}
                    </td>
                    <td className="factor-col">
                      {app.descriptionQualityDetails?.hasTargetUsersOrUseCases ? (
                        <span className="check-icon" title="Has target users or use cases" aria-label="Passes target users check" role="img">✓</span>
                      ) : (
                        <span className="cross-icon" title="Missing target users or use cases" aria-label="Fails target users check" role="img">✗</span>
                      )}
                    </td>
                    <td className="factor-col">
                      {app.descriptionQualityDetails?.hasApplicationIdentity ? (
                        <span className="check-icon" title="Has application identity" aria-label="Passes application identity check" role="img">✓</span>
                      ) : (
                        <span className="cross-icon" title="Missing application identity" aria-label="Fails application identity check" role="img">✗</span>
                      )}
                    </td>
                  </>
                )}
                {mode === 'siid' && (
                  <td className="word-count-cell">
                    {app.siId ? app.siId : <span style={{ color: '#dc2626' }}>Missing</span>}
                  </td>
                )}
                {mode === 'provider' && (
                  <>
                    <td className="word-count-cell">
                      {app.provider ? app.provider : <span style={{ color: '#dc2626' }}>Missing</span>}
                    </td>
                    <td className="word-count-cell">
                      {app.providerExternalId ? app.providerExternalId : <span style={{ color: '#dc2626' }}>Missing</span>}
                    </td>
                  </>
                )}
                {mode === 'webpageUrl' && (
                  <td className="word-count-cell">
                    {app.webpageUrl ? (
                      <a href={app.webpageUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>
                        {app.webpageUrl}
                      </a>
                    ) : (
                      <span style={{ color: '#dc2626' }}>Missing or Invalid</span>
                    )}
                  </td>
                )}
                {mode === 'applicationSubType' && (
                  <td className="word-count-cell">
                    {app.category ? (
                      <span>{app.category}</span>
                    ) : (
                      <span style={{ color: '#dc2626' }}>Missing</span>
                    )}
                  </td>
                )}
                {mode === 'pricingType' && (
                  <td className="word-count-cell">
                    {app.pricingType ? (
                      <span>{app.pricingType}</span>
                    ) : (
                      <span style={{ color: '#dc2626' }}>Missing</span>
                    )}
                  </td>
                )}
                {mode === 'hostingType' && (
                  <td className="hosting-type-cell">
                    {app.hostingType ? (
                      <span>{app.hostingType}</span>
                    ) : (
                      <span style={{ color: '#dc2626' }}>Missing</span>
                    )}
                  </td>
                )}
                {mode === 'itComponent' && (
                  <td className="word-count-cell">
                    {app.relITComponentToApplication && app.relITComponentToApplication.length > 0 ? (
                      <span style={{ color: '#dc2626' }}>All IT Components deprecated or not ready</span>
                    ) : (
                      <span style={{ color: '#dc2626' }}>No IT Component relation</span>
                    )}
                  </td>
                )}
                {mode === 'itComponentActiveDate' && (
                  <td className="word-count-cell">
                    <span style={{ color: '#dc2626' }}>Valid IT Components missing active dates</span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SimpleModal>
  );
}
