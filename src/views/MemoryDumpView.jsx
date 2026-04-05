import React, { useState } from 'react';

/**
 * MemoryDumpView — Shows raw EXIF JSON dump of the selected image.
 */
export default function MemoryDumpView({ files, selectedIndex, onSelectIndex }) {
  const [expandedSections, setExpandedSections] = useState({ exif: true, gps: true, xmp: false });
  const selected = files[selectedIndex] || null;

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (files.length === 0) {
    return (
      <div className="p-8 max-w-5xl mx-auto w-full">
        <header className="mb-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-3">Module: Memory Dump</div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Raw Data Viewer</h1>
        </header>
        <div className="bg-surface-container rounded-lg border border-outline-variant/10 p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-outline-variant/30 block mb-4">memory</span>
          <p className="font-mono text-xs text-on-surface-variant/50 uppercase tracking-widest">
            No files loaded — Drop images on Expose & Erase first
          </p>
        </div>
      </div>
    );
  }

  const rawTags = selected?.exifData?.raw || {};

  const sections = [
    { key: 'exif', label: 'EXIF Data', data: rawTags.exif, icon: 'photo_camera' },
    { key: 'gps', label: 'GPS Data', data: rawTags.gps, icon: 'location_on' },
    { key: 'xmp', label: 'XMP / IPTC Data', data: rawTags.xmp || rawTags.iptc, icon: 'description' },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <header className="mb-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-3">Module: Memory Dump</div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Raw Data Viewer</h1>
        <p className="text-on-surface-variant text-sm">
          Inspecting: <span className="font-mono text-primary">{selected?.file.name || '—'}</span>
        </p>
      </header>

      {/* File selector if multiple */}
      {files.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {files.map((f, i) => (
            <button
              key={f.id}
              onClick={() => onSelectIndex(i)}
              className={`flex-shrink-0 px-4 py-2 rounded-sm font-mono text-xs uppercase tracking-wider transition-all ${
                i === selectedIndex
                  ? 'bg-primary-container text-on-primary-container'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {f.file.name.length > 20 ? f.file.name.slice(0, 17) + '...' : f.file.name}
            </button>
          ))}
        </div>
      )}

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const hasData = section.data && Object.keys(section.data).length > 0;
          return (
            <div key={section.key} className="bg-surface-container rounded-lg border border-outline-variant/10 overflow-hidden">
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-container-high transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-sm ${hasData ? 'text-tertiary' : 'text-outline-variant'}`}>
                    {section.icon}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-on-surface">
                    {section.label}
                  </span>
                  {hasData && (
                    <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary text-[10px] font-mono rounded-sm">
                      {Object.keys(section.data).length} tags
                    </span>
                  )}
                  {!hasData && (
                    <span className="px-2 py-0.5 bg-secondary/10 text-secondary text-[10px] font-mono rounded-sm">
                      Empty
                    </span>
                  )}
                </div>
                <span className={`material-symbols-outlined text-on-surface-variant text-sm transition-transform ${expandedSections[section.key] ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              {expandedSections[section.key] && hasData && (
                <div className="px-6 pb-4">
                  <pre className="bg-surface-container-lowest p-4 rounded-sm text-xs font-mono text-on-surface-variant overflow-x-auto max-h-96 overflow-y-auto border border-outline-variant/5">
                    {JSON.stringify(section.data, (key, value) => {
                      // Simplify the display — show description if available
                      if (value && typeof value === 'object' && 'description' in value) {
                        return value.description;
                      }
                      return value;
                    }, 2)}
                  </pre>
                </div>
              )}
              {expandedSections[section.key] && !hasData && (
                <div className="px-6 pb-4">
                  <div className="bg-surface-container-lowest p-4 rounded-sm text-center">
                    <span className="font-mono text-[10px] text-on-surface-variant/40 uppercase">No data in this segment</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
