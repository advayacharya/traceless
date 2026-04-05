import React from 'react';

/**
 * DashboardView — Session statistics overview.
 * Shows total files processed, metadata tags stripped, GPS traces found, etc.
 */
export default function DashboardView({ files, sessionStats }) {
  const totalFiles = files.length;
  const sanitizedFiles = files.filter((f) => f.sanitized).length;
  const gpsFiles = files.filter((f) => f.exifData?.hasGps).length;
  const totalTags = files.reduce((acc, f) => {
    if (!f.exifData) return acc;
    const { identity, technical } = f.exifData;
    let count = 0;
    if (identity) count += Object.values(identity).filter(Boolean).length;
    if (technical) count += Object.values(technical).filter(Boolean).length;
    if (f.exifData.hasGps) count += 3; // lat, lng, alt
    return acc + count;
  }, 0);

  const statCards = [
    {
      icon: 'upload_file',
      label: 'Files Loaded',
      value: totalFiles,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: 'cleaning_services',
      label: 'Files Sanitized',
      value: sanitizedFiles,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: 'location_on',
      label: 'GPS Traces Found',
      value: gpsFiles,
      color: 'text-tertiary',
      bgColor: 'bg-tertiary/10',
    },
    {
      icon: 'label',
      label: 'Metadata Tags Exposed',
      value: totalTags,
      color: 'text-primary-dim',
      bgColor: 'bg-primary-dim/10',
    },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <header className="mb-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-3">
          Module: Dashboard
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
          Session Overview
        </h1>
        <p className="text-on-surface-variant text-sm">
          Real-time forensic processing statistics for the current session.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-surface-container p-6 rounded-lg border border-outline-variant/10 hover:border-outline-variant/30 transition-all"
          >
            <div className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center mb-4`}>
              <span className={`material-symbols-outlined ${card.color}`}>{card.icon}</span>
            </div>
            <div className="font-mono text-3xl font-bold text-on-surface mb-1">
              {card.value}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* File Activity Table */}
      {totalFiles > 0 && (
        <div className="bg-surface-container rounded-lg border border-outline-variant/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant/10">
            <h2 className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">
              File Activity Log
            </h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">#</th>
                <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Filename</th>
                <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Size</th>
                <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">GPS</th>
                <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {files.map((f, i) => (
                <tr key={f.id} className="hover:bg-surface-container-high transition-colors">
                  <td className="px-6 py-3 font-mono text-xs text-on-surface-variant">{i + 1}</td>
                  <td className="px-6 py-3 font-mono text-xs text-on-surface">{f.file.name}</td>
                  <td className="px-6 py-3 font-mono text-xs text-on-surface-variant">
                    {(f.file.size / 1024).toFixed(1)} KB
                  </td>
                  <td className="px-6 py-3">
                    {f.exifData?.hasGps ? (
                      <span className="inline-flex items-center gap-1 text-tertiary text-[10px] font-mono uppercase">
                        <span className="w-1.5 h-1.5 bg-tertiary rounded-full" />
                        Detected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-secondary text-[10px] font-mono uppercase">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                        Clean
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {f.sanitized ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-mono uppercase rounded-sm">
                        Sanitized
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-tertiary/10 text-tertiary text-[10px] font-mono uppercase rounded-sm">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalFiles === 0 && (
        <div className="bg-surface-container rounded-lg border border-outline-variant/10 p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-4">monitoring</span>
          <p className="font-mono text-xs text-on-surface-variant/50 uppercase tracking-widest">
            No files loaded — Drop images on Expose & Erase to begin
          </p>
        </div>
      )}
    </div>
  );
}
