import React from 'react';

/**
 * VaultView — Session history panel showing all processed files.
 */
export default function VaultView({ files, onNavigateToFile }) {
  const sanitizedFiles = files.filter((f) => f.sanitized);
  const pendingFiles = files.filter((f) => !f.sanitized);

  if (files.length === 0) {
    return (
      <div className="p-8 max-w-5xl mx-auto w-full">
        <header className="mb-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-3">Module: Vault</div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Session Vault</h1>
        </header>
        <div className="bg-surface-container rounded-lg border border-outline-variant/10 p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-4">inventory_2</span>
          <p className="font-mono text-xs text-on-surface-variant/50 uppercase tracking-widest">
            Vault is empty — Process files to populate
          </p>
        </div>
      </div>
    );
  }

  const renderFileCard = (entry, index) => {
    const { identity, technical, hasGps } = entry.exifData || {};
    const tagCount = [
      ...Object.values(identity || {}).filter(Boolean),
      ...Object.values(technical || {}).filter(Boolean),
    ].length + (hasGps ? 3 : 0);

    return (
      <div
        key={entry.id}
        onClick={() => onNavigateToFile(index)}
        className="bg-surface-container rounded-lg border border-outline-variant/10 p-5 hover:border-outline-variant/30 transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-surface-container-lowest rounded-sm overflow-hidden flex-shrink-0">
              <img
                src={URL.createObjectURL(entry.file)}
                alt={entry.file.name}
                className="w-full h-full object-cover"
                onLoad={(e) => URL.revokeObjectURL(e.target.src)}
              />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-xs text-on-surface truncate">{entry.file.name}</div>
              <div className="font-mono text-[10px] text-on-surface-variant/60">
                {(entry.file.size / 1024).toFixed(1)} KB
              </div>
            </div>
          </div>
          {entry.sanitized ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-mono uppercase rounded-sm flex-shrink-0">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
              Clean
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-tertiary/10 text-tertiary text-[10px] font-mono uppercase rounded-sm flex-shrink-0">
              <span className="w-1.5 h-1.5 bg-tertiary rounded-full" />
              Exposed
            </span>
          )}
        </div>
        <div className="flex gap-4 text-[10px] font-mono text-on-surface-variant/60 uppercase">
          <span>{tagCount} tags</span>
          <span>{hasGps ? '📍 GPS' : 'No GPS'}</span>
          {identity?.make && <span>{identity.make}</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <header className="mb-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-3">Module: Vault</div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Session Vault</h1>
        <p className="text-on-surface-variant text-sm">
          All files processed in this session. Click any file to inspect it in Expose & Erase.
        </p>
      </header>

      {sanitizedFiles.length > 0 && (
        <div className="mb-8">
          <h2 className="font-mono text-xs uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Sanitized ({sanitizedFiles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sanitizedFiles.map((f) => renderFileCard(f, files.indexOf(f)))}
          </div>
        </div>
      )}

      {pendingFiles.length > 0 && (
        <div>
          <h2 className="font-mono text-xs uppercase tracking-widest text-tertiary mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">warning</span>
            Pending ({pendingFiles.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingFiles.map((f) => renderFileCard(f, files.indexOf(f)))}
          </div>
        </div>
      )}
    </div>
  );
}
