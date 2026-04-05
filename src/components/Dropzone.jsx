import React, { useRef, useCallback } from 'react';

const MAX_FILES = 10;

export default function Dropzone({ onFilesSelected, fileCount = 0 }) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList).filter((f) =>
        f.type.startsWith('image/')
      );
      const allowed = files.slice(0, MAX_FILES - fileCount);
      if (allowed.length > 0) {
        onFilesSelected(allowed);
      }
    },
    [onFilesSelected, fileCount]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const onInputChange = useCallback(
    (e) => {
      handleFiles(e.target.files);
      // Reset so the same file can be re-selected
      e.target.value = '';
    },
    [handleFiles]
  );

  return (
    <div className="w-full flex flex-col items-center justify-center px-6 py-12 max-w-6xl mx-auto">
      {/* Headline */}
      <div className="text-center mb-12">
        <div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60 mb-4">
          Module: 0x88FF
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-on-surface tracking-tighter mb-4">
          REVEAL THE INVISIBLE
        </h1>
        <p className="text-on-surface-variant max-w-lg mx-auto text-sm leading-relaxed">
          High-fidelity metadata extraction and forensic purging. All processing occurs locally within your encrypted browser environment.
        </p>
      </div>

      {/* Central Dropzone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`w-full max-w-3xl aspect-[16/9] bg-surface-container-low rounded-lg border-2 border-dashed flex flex-col items-center justify-center group cursor-pointer relative overflow-hidden transition-all duration-500 ${
          isDragOver
            ? 'border-primary/60 bg-primary/5'
            : 'border-outline-variant/20 hover:border-primary/40'
        }`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent transition-opacity duration-500 ${isDragOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6 border border-outline-variant/10 group-hover:scale-110 transition-transform duration-500">
            <span className={`material-symbols-outlined text-4xl transition-colors ${isDragOver ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
              upload_file
            </span>
          </div>
          <button
            type="button"
            className="bg-[#5a7d7c] hover:bg-[#6b8e8d] text-white px-8 py-3 rounded-sm font-medium text-sm tracking-tight transition-all active:scale-95 shadow-lg shadow-black/20 mb-4"
          >
            Select Source File
          </button>
          <p className="text-on-surface-variant/60 font-mono text-[11px] uppercase tracking-widest">
            Drag and drop forensic assets here ({fileCount}/{MAX_FILES})
          </p>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-outline-variant/30" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-outline-variant/30" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-outline-variant/30" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-outline-variant/30" />

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {/* Feature Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-4xl">
        <div className="bg-surface-container p-6 rounded-lg border border-outline-variant/10 hover:border-outline-variant/30 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-secondary text-xl">visibility</span>
            <h3 className="font-mono text-xs font-bold tracking-widest uppercase text-on-surface">EXPOSE</h3>
          </div>
          <p className="text-[12px] text-on-surface-variant leading-relaxed">
            Decrypt hidden layers and audit embedded EXIF/GPS coordinate chains from any image source.
          </p>
        </div>
        <div className="bg-surface-container p-6 rounded-lg border border-outline-variant/10 hover:border-outline-variant/30 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-primary text-xl">cleaning_services</span>
            <h3 className="font-mono text-xs font-bold tracking-widest uppercase text-on-surface">SANITIZE</h3>
          </div>
          <p className="text-[12px] text-on-surface-variant leading-relaxed">
            Irreversibly strip tracking fingerprints and metadata signatures without affecting visual fidelity.
          </p>
        </div>
        <div className="bg-surface-container p-6 rounded-lg border border-outline-variant/10 hover:border-outline-variant/30 transition-all group">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-tertiary-dim text-xl">verified_user</span>
            <h3 className="font-mono text-xs font-bold tracking-widest uppercase text-on-surface">SECURE</h3>
          </div>
          <p className="text-[12px] text-on-surface-variant leading-relaxed">
            Execute 256-bit hash verification to ensure the integrity of the sanitized output file.
          </p>
        </div>
      </div>
    </div>
  );
}
