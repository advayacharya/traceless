import React from 'react';

export default function BatchThumbnails({ files, selectedIndex, onSelect, onAddMore }) {
  return (
    <section className="bg-surface-container-lowest p-6 border-t border-outline-variant/5">
      <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
        {files.map((entry, i) => {
          const url = URL.createObjectURL(entry.file);
          return (
            <div
              key={entry.id}
              onClick={() => onSelect(i)}
              className={`flex-shrink-0 w-24 h-24 bg-surface-container rounded-sm overflow-hidden relative cursor-pointer transition-all ${
                i === selectedIndex
                  ? 'border-2 border-primary opacity-100'
                  : 'opacity-40 hover:opacity-100'
              }`}
            >
              <img
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                src={url}
                onLoad={() => URL.revokeObjectURL(url)}
              />
              {i === selectedIndex && (
                <div className="absolute inset-0 bg-primary/10" />
              )}
              {entry.sanitized && (
                <div className="absolute bottom-1 right-1">
                  <span className="material-symbols-outlined text-secondary text-sm bg-surface-container-highest/80 rounded-full p-0.5">check_circle</span>
                </div>
              )}
            </div>
          );
        })}
        {files.length < 10 && (
          <div
            onClick={onAddMore}
            className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center text-on-surface-variant hover:border-primary/40 hover:text-primary transition-all cursor-pointer rounded-sm"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="text-[8px] font-mono mt-1 uppercase">Queue</span>
          </div>
        )}
      </div>
    </section>
  );
}
