import React from 'react';

/**
 * SettingsView — User preferences panel.
 * Controls JPEG quality, auto-download behavior, etc.
 */
export default function SettingsView({ settings, onUpdateSettings }) {
  const handleQualityChange = (e) => {
    onUpdateSettings({ ...settings, jpegQuality: parseFloat(e.target.value) });
  };

  const handleAutoDownloadChange = () => {
    onUpdateSettings({ ...settings, autoDownload: !settings.autoDownload });
  };

  const handleAutoAdvanceChange = () => {
    onUpdateSettings({ ...settings, autoAdvanceNext: !settings.autoAdvanceNext });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto w-full">
      <header className="mb-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-3">Module: System Settings</div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Configuration</h1>
        <p className="text-on-surface-variant text-sm">
          Adjust processing parameters. All settings are session-only and not persisted.
        </p>
      </header>

      <div className="space-y-6">
        {/* JPEG Quality Slider */}
        <div className="bg-surface-container rounded-lg border border-outline-variant/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary text-sm">high_quality</span>
            <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface">JPEG Export Quality</h3>
          </div>
          <div className="flex items-center gap-6">
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={settings.jpegQuality}
              onChange={handleQualityChange}
              className="flex-1 h-1 bg-outline-variant/20 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="w-20 text-right">
              <span className="font-mono text-lg font-bold text-on-surface">
                {Math.round(settings.jpegQuality * 100)}%
              </span>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-mono text-[10px] text-on-surface-variant/50 uppercase">Smaller File</span>
            <span className="font-mono text-[10px] text-on-surface-variant/50 uppercase">Higher Quality</span>
          </div>
        </div>

        {/* Auto-Download Toggle */}
        <div className="bg-surface-container rounded-lg border border-outline-variant/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm">download</span>
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface">Auto-Download After Nuke</h3>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Automatically trigger file download after sanitization completes.
                </p>
              </div>
            </div>
            <button
              onClick={handleAutoDownloadChange}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.autoDownload ? 'bg-primary' : 'bg-outline-variant/30'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-on-surface absolute top-0.5 transition-transform ${
                  settings.autoDownload ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Auto-Advance Toggle */}
        <div className="bg-surface-container rounded-lg border border-outline-variant/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-sm">skip_next</span>
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface">Auto-Advance in Batch</h3>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Automatically select the next file in the queue after viewing one.
                </p>
              </div>
            </div>
            <button
              onClick={handleAutoAdvanceChange}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                settings.autoAdvanceNext ? 'bg-primary' : 'bg-outline-variant/30'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-on-surface absolute top-0.5 transition-transform ${
                  settings.autoAdvanceNext ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-surface-container rounded-lg border border-outline-variant/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary text-sm">info</span>
            <h3 className="font-mono text-xs uppercase tracking-widest text-on-surface">System Information</h3>
          </div>
          <div className="space-y-2">
            {[
              ['Version', 'V3.4.1'],
              ['Engine', 'HTML5 Canvas + Web Crypto API'],
              ['Parser', 'ExifReader v4.x'],
              ['Bundler', 'JSZip v3.x'],
              ['Cartography', 'Leaflet v1.9.x'],
              ['Framework', 'React + Vite'],
              ['Network Policy', 'Zero Outbound — Client-Only'],
            ].map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-outline-variant/5 last:border-0">
                <span className="font-mono text-[11px] text-on-surface-variant uppercase">{key}</span>
                <span className="font-mono text-xs text-on-surface">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
