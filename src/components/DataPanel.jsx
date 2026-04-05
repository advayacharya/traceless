import React from 'react';

/**
 * Builds the forensic data table rows from parsed EXIF data.
 */
function buildTableRows(identity, location, technical, isSanitized) {
  const rows = [];

  // Identity section
  if (identity.make) rows.push({ tag: 'Device Make', value: identity.make, sanitized: 'REDACTED' });
  if (identity.model) rows.push({ tag: 'Camera Model', value: identity.model, sanitized: 'REDACTED' });
  if (identity.lensModel) rows.push({ tag: 'Lens Model', value: identity.lensModel, sanitized: 'GENERIC_OPTIC' });
  if (identity.software) rows.push({ tag: 'Software Ver', value: identity.software, sanitized: 'NULL' });
  if (identity.artist) rows.push({ tag: 'Artist', value: identity.artist, sanitized: 'ANONYMOUS' });
  if (identity.ownerName) rows.push({ tag: 'Owner Name', value: identity.ownerName, sanitized: 'ANONYMOUS' });
  if (identity.copyright) rows.push({ tag: 'Copyright', value: identity.copyright, sanitized: 'NULL' });
  if (identity.serialNumber) rows.push({ tag: 'Serial Number', value: identity.serialNumber, sanitized: '0x000000' });

  // Location section
  if (location) {
    rows.push({
      tag: 'GPS Latitude',
      value: `${location.latitude.toFixed(6)}°`,
      sanitized: '0.000000°',
    });
    rows.push({
      tag: 'GPS Longitude',
      value: `${location.longitude.toFixed(6)}°`,
      sanitized: '0.000000°',
    });
    if (location.altitude != null) {
      rows.push({
        tag: 'GPS Altitude',
        value: `${location.altitude}m`,
        sanitized: '0.0m',
      });
    }
  }

  // Technical section
  if (technical.dateTimeOriginal) rows.push({ tag: 'Creation Date', value: technical.dateTimeOriginal, sanitized: '2024:01:01 00:00:00' });
  if (technical.fNumber) rows.push({ tag: 'F-Stop', value: technical.fNumber, sanitized: '—' });
  if (technical.exposureTime) rows.push({ tag: 'Exposure', value: technical.exposureTime, sanitized: '—' });
  if (technical.iso) rows.push({ tag: 'ISO', value: technical.iso, sanitized: '—' });
  if (technical.focalLength) rows.push({ tag: 'Focal Length', value: technical.focalLength, sanitized: '—' });
  if (technical.flash) rows.push({ tag: 'Flash', value: technical.flash, sanitized: '—' });
  if (technical.whiteBalance) rows.push({ tag: 'White Balance', value: technical.whiteBalance, sanitized: '—' });
  if (technical.colorSpace) rows.push({ tag: 'Color Space', value: technical.colorSpace, sanitized: '—' });
  if (technical.imageWidth && technical.imageHeight) {
    rows.push({ tag: 'Resolution', value: `${technical.imageWidth} × ${technical.imageHeight}`, sanitized: '—' });
  }

  return rows;
}

export default function DataPanel({ identity, location, technical, isSanitized, onNuke, isProcessing, progress }) {
  const rows = buildTableRows(identity, location, technical, isSanitized);

  const hasData = rows.length > 0;

  return (
    <section className="lg:w-7/12 p-8 relative flex flex-col bg-surface-container-low min-h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-on-surface-variant">
          Forensic Data Stream
        </h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSanitized ? 'bg-outline-variant' : 'bg-tertiary'}`} />
            <span className={`text-[10px] font-mono uppercase ${isSanitized ? 'text-outline-variant' : 'text-tertiary-dim'}`}>Exposed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSanitized ? 'bg-secondary' : 'bg-outline-variant'}`} />
            <span className={`text-[10px] font-mono uppercase ${isSanitized ? 'text-secondary-dim' : 'text-outline-variant'}`}>Sanitized</span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!hasData && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant/30 mb-4 block">search_off</span>
            <p className="font-mono text-xs text-on-surface-variant/50 uppercase tracking-widest">
              No metadata signatures detected
            </p>
          </div>
        </div>
      )}

      {/* Data Table */}
      {hasData && (
        <div className="flex-1 overflow-y-auto mb-24">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10">
                <th className="py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Tag Name</th>
                <th className="py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Original Value</th>
                <th className="py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Sanitized Output</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {rows.map((row, i) => (
                <tr key={i} className="group hover:bg-surface-container transition-colors">
                  <td className="py-4 font-medium text-xs text-on-surface">{row.tag}</td>
                  <td className={`py-4 font-mono text-xs ${isSanitized ? 'text-outline-variant line-through' : 'text-tertiary'}`}>
                    {row.value}
                  </td>
                  <td className={`py-4 font-mono text-xs italic ${isSanitized ? 'text-secondary' : 'text-on-surface-variant/30'}`}>
                    {row.sanitized}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sticky Action Button */}
      {hasData && (
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-surface-container-low/90 backdrop-blur-xl border-t border-outline-variant/10">
          {isSanitized ? (
            <div className="w-full flex items-center justify-center gap-3 bg-secondary-container text-on-secondary-container py-4 font-bold tracking-widest text-sm rounded-sm">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              METADATA NUKED — FILE DOWNLOADED
            </div>
          ) : (
            <button
              onClick={onNuke}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-3 bg-primary-container text-on-primary-container py-4 font-bold tracking-widest text-sm hover:bg-primary/20 transition-all active:scale-[0.98] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                  PROCESSING {progress}...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">auto_fix_high</span>
                  NUKE METADATA &amp; DOWNLOAD
                </>
              )}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
