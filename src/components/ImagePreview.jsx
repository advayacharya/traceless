import React from 'react';

export default function ImagePreview({ file, hasExif }) {
  const [previewUrl, setPreviewUrl] = React.useState(null);

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!previewUrl) return null;

  return (
    <div className="relative group aspect-square bg-surface-container-lowest overflow-hidden rounded-sm border border-outline-variant/10">
      <img
        alt="Uploaded asset"
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        src={previewUrl}
      />
      {hasExif && (
        <div className="absolute top-4 left-4 bg-surface-container-highest/80 backdrop-blur-md px-3 py-1 rounded-sm border border-outline-variant/20">
          <span className="font-mono text-[10px] text-tertiary uppercase tracking-tighter">
            Exposed Signature Detected
          </span>
        </div>
      )}
    </div>
  );
}
