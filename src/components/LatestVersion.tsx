import { useState, useEffect, useCallback } from 'react';
import { getLatestFile, getDownloadUrl, formatDate } from '../services/googleDriveService';
import '../styles/LatestVersion.css';

interface LatestFile {
  id: string;
  name: string;
  modifiedTime?: string;
}

interface VersionState {
  file: LatestFile | null;
  loading: boolean;
  error: string | null;
}

export default function LatestVersion() {
  const [state, setState] = useState<VersionState>({
    file: null,
    loading: true,
    error: null,
  });

  const loadLatestFile = useCallback(async () => {
    setState({ file: null, loading: true, error: null });
    try {
      const file = await getLatestFile();
      if (file) {
        setState({
          file: {
            id: file.id,
            name: file.name,
            modifiedTime: file.modifiedTime,
          },
          loading: false,
          error: null,
        });
      } else {
        setState({
          file: null,
          loading: false,
          error: 'No files available',
        });
      }
    } catch (err) {
      setState({
        file: null,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch latest version',
      });
    }
  }, []);

  useEffect(() => {
    loadLatestFile();
  }, [loadLatestFile]);

  return (
    <div className="latest-version-page">
      <div className="page-wrapper">
        <div className="page-header">
          <h1>Latest Version</h1>
          <p>Download the latest version of PMS Updater</p>
        </div>

        {state.loading && (
          <div className="version-card">
            <div className="version-spinner">Loading...</div>
          </div>
        )}

        {state.error && !state.loading && (
          <div className="version-card">
            <div className="version-error">{state.error}</div>
          </div>
        )}

        {!state.loading && !state.error && state.file && (
          <div className="version-card">
            <div className="version-content">
              <h2>Latest Release</h2>
              <p className="version-name">{state.file.name}</p>
              {state.file.modifiedTime && (
                <p className="version-date">Updated {formatDate(state.file.modifiedTime)}</p>
              )}
            </div>
            <a href={getDownloadUrl(state.file.id)} download className="version-button">
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}


