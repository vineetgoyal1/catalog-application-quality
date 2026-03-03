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

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle}>
      <div className="drilldown-search">
        <input
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="drilldown-search-input"
        />
      </div>

      <div className="drilldown-count">
        Showing {filteredApplications.length} of {applications.length} applications
      </div>

      <div className="drilldown-table-container">
        <table className="drilldown-table">
          <thead>
            <tr>
              <th>Application Name</th>
              {mode === 'description' && <th>Word Count</th>}
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
              {mode === 'hostingType' && <th>Hosting Type</th>}
              {mode === 'itComponent' && <th>IT Component Status</th>}
              {mode === 'itComponentActiveDate' && <th>Active Date Status</th>}
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id}>
                <td>
                  {workspaceHost ? (
                    <a
                      href={`https://${workspaceHost}/factsheet/Application/${app.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="app-link"
                    >
                      {app.displayName}
                    </a>
                  ) : (
                    <span>{app.displayName}</span>
                  )}
                </td>
                {mode === 'description' && (
                  <td className="word-count-cell">{app.wordCount} words</td>
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
                  <td className="word-count-cell">
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
