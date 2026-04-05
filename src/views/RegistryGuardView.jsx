import React, { useState, useCallback } from 'react';
import { computeSHA256 } from '../utils/hashUtils';
import { stripMetadata } from '../utils/sanitizationEngine';
import { logAudit } from '../utils/auditLog';

/**
 * RegistryGuardView — SHA-256 hash verification panel.
 * Computes hashes before and after sanitization to prove file integrity.
 */
export default function RegistryGuardView({ files }) {
  const [hashResults, setHashResults] = useState([]); // [{filename, originalHash, cleanHash, status}]
  const [isComputing, setIsComputing] = useState(false);
  const [computeProgress, setComputeProgress] = useState('');

  const computeHashes = useCallback(async () => {
    if (files.length === 0 || isComputing) return;
    setIsComputing(true);
    setHashResults([]);

    const results = [];
    for (let i = 0; i < files.length; i++) {
      const entry = files[i];
      setComputeProgress(`(${i + 1}/${files.length})`);

      try {
        // Hash the original file
        logAudit('HASH_COMPUTE', `Computing SHA-256 for original: ${entry.file.name}`);
        const originalHash = await computeSHA256(entry.file);

        // Strip metadata and hash the clean version
        const orientation = entry.exifData?.orientation || 1;
        const { blob } = await stripMetadata(entry.file, orientation);
        logAudit('HASH_COMPUTE', `Computing SHA-256 for sanitized: ${entry.file.name}`);
        const cleanHash = await computeSHA256(blob);

        results.push({
          filename: entry.file.name,
          size: entry.file.size,
          originalHash,
          cleanHash,
          different: originalHash !== cleanHash,
        });
      } catch (err) {
        results.push({
          filename: entry.file.name,
          size: entry.file.size,
          originalHash: 'ERROR',
          cleanHash: 'ERROR',
          different: false,
        });
      }
    }

    setHashResults(results);
    setIsComputing(false);
    setComputeProgress('');
  }, [files, isComputing]);

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <header className="mb-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-3">Module: Registry Guard</div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Integrity Verification</h1>
        <p className="text-on-surface-variant text-sm">
          Computes SHA-256 hashes of original vs. sanitized files to verify metadata was successfully stripped.
        </p>
      </header>

      {files.length === 0 ? (
        <div className="bg-surface-container rounded-lg border border-outline-variant/10 p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-4">shield</span>
          <p className="font-mono text-xs text-on-surface-variant/50 uppercase tracking-widest">
            No files loaded — Drop images on Expose & Erase first
          </p>
        </div>
      ) : (
        <>
          {/* Compute Button */}
          <button
            onClick={computeHashes}
            disabled={isComputing}
            className="mb-6 flex items-center gap-3 bg-primary-container text-on-primary-container px-6 py-3 font-bold tracking-widest text-sm hover:bg-primary/20 transition-all active:scale-[0.98] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isComputing ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                COMPUTING HASHES {computeProgress}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">fingerprint</span>
                COMPUTE SHA-256 INTEGRITY CHECK
              </>
            )}
          </button>

          {/* Results */}
          {hashResults.length > 0 && (
            <div className="space-y-4">
              {hashResults.map((result, i) => (
                <div key={i} className="bg-surface-container rounded-lg border border-outline-variant/10 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-sm text-primary">insert_drive_file</span>
                      <span className="font-mono text-xs text-on-surface">{result.filename}</span>
                      <span className="font-mono text-[10px] text-on-surface-variant">
                        ({(result.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    {result.different ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-mono uppercase rounded-sm">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        Hash Changed — Metadata Stripped
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-tertiary/10 text-tertiary text-[10px] font-mono uppercase rounded-sm">
                        <span className="material-symbols-outlined text-xs">warning</span>
                        Identical Hash
                      </span>
                    )}
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
                        Original SHA-256
                      </div>
                      <div className="font-mono text-xs text-tertiary bg-surface-container-lowest px-3 py-2 rounded-sm break-all border border-outline-variant/5">
                        {result.originalHash}
                      </div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-1">
                        Sanitized SHA-256
                      </div>
                      <div className="font-mono text-xs text-secondary bg-surface-container-lowest px-3 py-2 rounded-sm break-all border border-outline-variant/5">
                        {result.cleanHash}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
