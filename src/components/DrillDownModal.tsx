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
  mode: 'description' | 'siid' | 'provider';
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SimpleModal>
  );
}
