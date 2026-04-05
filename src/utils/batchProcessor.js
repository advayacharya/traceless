/**
 * Batch Processor — Bundles multiple sanitized images into a .zip
 */
import JSZip from 'jszip';
import { stripMetadata, downloadBlob } from './sanitizationEngine';

/**
 * Strips metadata from multiple files and downloads as a zip.
 * @param {Array<{file: File, orientation: number}>} fileEntries
 * @param {Function} onProgress - callback(index, total) for progress updates
 * @returns {Promise<void>}
 */
export async function processBatch(fileEntries, onProgress) {
  if (fileEntries.length === 0) return;

  // Single file — just download directly
  if (fileEntries.length === 1) {
    const { file, orientation } = fileEntries[0];
    const result = await stripMetadata(file, orientation);
    downloadBlob(result.blob, result.filename);
    onProgress?.(1, 1);
    return;
  }

  // Multiple files — bundle into a zip
  const zip = new JSZip();

  for (let i = 0; i < fileEntries.length; i++) {
    const { file, orientation } = fileEntries[i];
    const result = await stripMetadata(file, orientation);
    zip.file(result.filename, result.blob);
    onProgress?.(i + 1, fileEntries.length);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, 'forensic-clean-batch.zip');
}
