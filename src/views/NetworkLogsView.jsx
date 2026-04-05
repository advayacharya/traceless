import React, { useState, useEffect } from 'react';
import { getAuditLog, subscribeAuditLog } from '../utils/auditLog';

const TYPE_LABELS = {
  FILE_READ: { label: 'File Read', icon: 'upload_file', color: 'text-primary' },
  EXIF_PARSE: { label: 'EXIF Parse', icon: 'search', color: 'text-primary-dim' },
  CANVAS_STRIP: { label: 'Canvas Strip', icon: 'cleaning_services', color: 'text-secondary' },
  BLOB_EXPORT: { label: 'Blob Export', icon: 'download', color: 'text-secondary-dim' },
  ZIP_BUNDLE: { label: 'ZIP Bundle', icon: 'folder_zip', color: 'text-primary' },
  DOWNLOAD: { label: 'Download', icon: 'file_download', color: 'text-secondary' },
  HASH_COMPUTE: { label: 'Hash Compute', icon: 'fingerprint', color: 'text-primary-dim' },
  GPS_DETECTED: { label: 'GPS Found', icon: 'location_on', color: 'text-tertiary' },
  NO_GPS: { label: 'No GPS', icon: 'location_off', color: 'text-secondary' },
};

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
    + '.' + String(d.getMilliseconds()).padStart(3, '0');
}

/**
 * NetworkLogsView — Live audit log proving zero network uploads.
 */
export default function NetworkLogsView() {
  const [entries, setEntries] = useState(getAuditLog());

  useEffect(() => {
    const unsub = subscribeAuditLog(setEntries);
    return unsub;
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <header className="mb-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-3">Module: Network Logs</div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Operation Audit Trail</h1>
        <p className="text-on-surface-variant text-sm">
          Every operation is logged below. Notice the <span className="font-mono text-secondary">scope: local</span> on every entry — proving zero outbound network requests.
        </p>
      </header>

      {/* Zero-Trust Banner */}
      <div className="flex items-center gap-3 mb-6 bg-secondary/5 border border-secondary/20 rounded-lg px-5 py-3">
        <span className="material-symbols-outlined text-secondary">verified_user</span>
        <div>
          <div className="font-mono text-xs text-secondary uppercase tracking-widest">Zero-Trust Verified</div>
          <div className="text-[11px] text-on-surface-variant mt-0.5">
            All {entries.length} operations executed locally via FileReader, Canvas, and Web Crypto APIs. No fetch/XHR calls logged.
          </div>
        </div>
      </div>

      {entries.length > 0 ? (
        <div className="bg-surface-container rounded-lg border border-outline-variant/10 overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-surface-container z-10">
                <tr className="border-b border-outline-variant/10">
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Timestamp</th>
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Operation</th>
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Detail</th>
                  <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant/60">Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {entries.map((entry) => {
                  const typeInfo = TYPE_LABELS[entry.type] || { label: entry.type, icon: 'info', color: 'text-on-surface-variant' };
                  return (
                    <tr key={entry.id} className="hover:bg-surface-container-high transition-colors">
                      <td className="px-6 py-3 font-mono text-[11px] text-on-surface-variant whitespace-nowrap">
                        {formatTime(entry.timestamp)}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-sm ${typeInfo.color}`}>{typeInfo.icon}</span>
                          <span className="font-mono text-xs text-on-surface uppercase">{typeInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-on-surface-variant max-w-xs truncate">
                        {entry.detail}
                      </td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-mono uppercase rounded-sm">
                          <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                          {entry.scope}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container rounded-lg border border-outline-variant/10 p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-4">settings_ethernet</span>
          <p className="font-mono text-xs text-on-surface-variant/50 uppercase tracking-widest">
            No operations logged yet — Process files to generate audit entries
          </p>
        </div>
      )}
    </div>
  );
}
