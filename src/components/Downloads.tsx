import { useState, useEffect, useCallback } from 'react';
import {
  fetchFilesFromDrive,
  getDownloadUrl,
  formatFileSize,
  formatDate,
} from '../services/googleDriveService';
import '../styles/Downloads.css';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
}

interface DownloadState {
  files: DriveFile[];
  loading: boolean;
  error: string | null;
}

export default function Downloads() {
  const [state, setState] = useState<DownloadState>({
    files: [],
    loading: true,
    error: null,
  });

  const [searchTerm, setSearchTerm] = useState('');

  const loadFiles = useCallback(async () => {
    setState({ files: [], loading: true, error: null });
    try {
      const files = await fetchFilesFromDrive(searchTerm || undefined);
      setState({
        files,
        loading: false,
        error: files.length === 0 ? 'No files found' : null,
      });
    } catch (err) {
      setState({
        files: [],
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch files',
      });
    }
  }, [searchTerm]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadFiles();
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('application/vnd.ms-excel') || mimeType.includes('spreadsheet')) {
      return '📊';
    }
    if (mimeType.includes('word') || mimeType.includes('document')) {
      return '📄';
    }
    if (mimeType.includes('pdf')) {
      return '📕';
    }
    if (mimeType.includes('zip') || mimeType.includes('compressed')) {
      return '📦';
    }
    if (mimeType.includes('executable') || mimeType.includes('application/x-msdownload')) {
      return '⚙️';
    }
    return '📁';
  };

  return (
    <div className="downloads-container">
      <div className="downloads-header">
        <h1>All Downloads</h1>
        <p>Browse and download available versions</p>
      </div>

      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
        <button
          type="button"
          className="search-button reset"
          onClick={() => {
            setSearchTerm('');
            setState({ files: [], loading: true, error: null });
            loadFiles();
          }}
        >
          Clear
        </button>
      </form>

      {state.loading && <div className="loading">Loading files...</div>}

      {state.error && !state.loading && state.files.length === 0 && (
        <div className="error-message">{state.error}</div>
      )}

      {state.files.length > 0 && (
        <div className="files-list">
          <div className="files-info">
            Found {state.files.length} file{state.files.length !== 1 ? 's' : ''}
          </div>
          <ul className="file-items">
            {state.files.map((file) => (
              <li key={file.id} className="file-item">
                <div className="file-info-wrapper">
                  <span className="file-icon">{getFileIcon(file.mimeType)}</span>
                  <div className="file-details">
                    <div className="file-name">{file.name}</div>
                    <div className="file-meta">
                      {file.size && <span>{formatFileSize(file.size)}</span>}
                      {file.modifiedTime && (
                        <span>{formatDate(file.modifiedTime)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <a
                  href={getDownloadUrl(file.id)}
                  download={file.name}
                  className="download-button"
                  title={`Download ${file.name}`}
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="setup-info">
        <h3>Setup Instructions</h3>
        <ol>
          <li>
            Get API Key from{' '}
            <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">
              Google Cloud Console
            </a>
          </li>
          <li>Enable Google Drive API</li>
          <li>Create a public folder in Google Drive</li>
          <li>
            Add your <code>VITE_GOOGLE_DRIVE_API_KEY</code> and <code>VITE_GOOGLE_DRIVE_FOLDER_ID</code> to <code>.env.local</code>
          </li>
          <li>Restart the dev server</li>
        </ol>
      </div>
    </div>
  );
}


