/**
 * Google Drive API Service
 * Handles fetching files from Google Drive
 */

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
}

interface DriveResponse {
  files: DriveFile[];
}

const API_KEY = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
const FOLDER_ID = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID;

/**
 * Fetch files from Google Drive folder
 * @param query Optional query string to filter files
 * @returns Promise containing array of files
 */
export async function fetchFilesFromDrive(query?: string): Promise<DriveFile[]> {
  if (!API_KEY || !FOLDER_ID) {
    throw new Error('Google Drive API key or Folder ID not configured');
  }

  try {
    const searchQuery = query
      ? `'${FOLDER_ID}' in parents and trashed=false and name contains '${query}'`
      : `'${FOLDER_ID}' in parents and trashed=false`;

    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.append('q', searchQuery);
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('spaces', 'drive');
    url.searchParams.append('fields', 'files(id, name, mimeType, size, createdTime, modifiedTime)');
    url.searchParams.append('pageSize', '100');
    url.searchParams.append('orderBy', 'modifiedTime desc');

    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorMsg = `Google Drive API error: ${response.status} ${response.statusText}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    const data: DriveResponse = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error fetching files from Google Drive:', error);
    throw error;
  }
}

/**
 * Get the latest file from the folder
 * Useful for getting the latest app version
 */
export async function getLatestFile(): Promise<DriveFile | null> {
  try {
    const files = await fetchFilesFromDrive();
    return files.length > 0 ? files[0] : null;
  } catch (error) {
    console.error('Error getting latest file:', error);
    return null;
  }
}

/**
 * Generate download link for a file
 * @param fileId Google Drive file ID
 * @returns Direct download URL
 */
export function getDownloadUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Get file size in human-readable format
 * @param bytes File size in bytes
 * @returns Formatted file size
 */
export function formatFileSize(bytes?: string): string {
  if (!bytes) return 'Unknown';
  const size = parseInt(bytes, 10);
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let formattedSize = size;

  while (formattedSize >= 1024 && unitIndex < units.length - 1) {
    formattedSize /= 1024;
    unitIndex++;
  }

  return `${formattedSize.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Format date to readable format
 * @param dateString ISO date string
 * @returns Formatted date
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return 'Unknown';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}


