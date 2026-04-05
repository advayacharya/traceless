import React, { useState, useEffect } from 'react';

export default function LandingPage({ onEnter }) {
  const [isHovered, setIsHovered] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const fullText = `> Analyzing EXIF Header...
> GPS LAT: 40.7128° N
> GPS LON: 74.0060° W
> ALTITUDE: 14.5m
> DEVICE: Apple iPhone 15 Pro Max
> LENS: 24mm f/1.78
> EXPOSURE: 1/120s ISO 80
> TIMESTAMP: 2024-05-14T14:32:01Z`;

  // Typing animation
  useEffect(() => {
    let timeout;
    if (isHovered) {
      setTypingComplete(false);
      let currentIndex = 0;
      const typeChar = () => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex));
          currentIndex++;
          timeout = setTimeout(typeChar, 15);
        } else {
          setTypingComplete(true);
        }
      };
      typeChar();
    } else {
      setTypedText('');
      setTypingComplete(false);
    }
    return () => clearTimeout(timeout);
  }, [isHovered, fullText]);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => onEnter(), 600);
  };

  return (
    <div
      className={`relative min-h-screen text-on-surface font-body flex flex-col items-center justify-center py-20 px-6 overflow-hidden transition-all duration-600 ${
        isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle gradient overlay for depth over the global Vanta background */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-[#0c0e12]/80 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center gap-12">

        {/* Logo / Brand */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary-container/40 backdrop-blur-sm border border-outline-variant/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-on-surface-variant/60">Forensic Unit</span>
        </div>

        {/* Hero Copy */}
        <div className="flex flex-col items-center">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-on-surface mb-6 leading-[1.1]">
            Your photos are <br className="hidden lg:block" />
            <span className="relative inline-block" style={{ color: '#ee7d77' }}>
              secretly broadcasting
              <svg className="absolute -bottom-2 w-full h-3 opacity-50" style={{ color: '#ee7d77' }} viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
            <br className="hidden lg:block" /> where you live.
          </h1>
          <p className="text-lg lg:text-xl text-on-surface-variant font-light max-w-2xl leading-relaxed">
            Every picture you share contains hidden GPS coordinates and device data.{' '}
            <span className="text-primary font-medium">Expose & Erase</span> permanently strips it — directly in your browser. Zero servers. Total privacy.
          </p>
        </div>

        {/* Interactive Photo Demo */}
        <div className="w-full max-w-3xl">
          <div
            className="relative rounded-xl overflow-hidden border border-outline-variant/20 shadow-2xl shadow-black/40 cursor-crosshair group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Fake UI Header */}
            <div className="absolute top-0 w-full h-10 bg-surface-container/90 backdrop-blur-md border-b border-outline-variant/20 flex items-center px-4 z-20">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ee7d77' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#e8c96e' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#91a384' }} />
              </div>
              <span className="ml-4 text-xs font-mono text-on-surface-variant/60">
                IMG_4921.heic{' '}
                <span className="text-primary ml-2 animate-pulse">Hover to scan</span>
              </span>
            </div>

            {/* The Photo */}
            <img
              src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1200&q=80"
              alt="Innocent looking park"
              className={`w-full h-[400px] lg:h-[500px] object-cover transition-all duration-700 ${
                isHovered ? 'scale-110 blur-[2px] grayscale contrast-125' : 'scale-100'
              }`}
            />

            {/* The Data Overlay */}
            <div
              className={`absolute inset-0 z-10 transition-opacity duration-300 flex flex-col justify-center px-8 pt-10 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundColor: 'rgba(12, 14, 18, 0.88)', backdropFilter: 'blur(4px)' }}
            >
              {/* Simulated Map Pin */}
              <div
                className={`absolute top-16 right-8 transition-all duration-700 delay-300 ${
                  isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}
              >
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(238, 125, 119, 0.1)', border: '1px solid rgba(238, 125, 119, 0.3)' }}>
                  <span className="material-symbols-outlined text-sm" style={{ color: '#ee7d77' }}>location_on</span>
                  <span className="font-mono text-sm" style={{ color: '#ee7d77' }}>Target Located</span>
                </div>
              </div>

              {/* Typed EXIF Data */}
              <div className="font-mono text-sm md:text-base leading-relaxed text-on-surface-variant whitespace-pre-wrap text-left">
                {typedText.split('\n').map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.includes('LAT') || line.includes('LON') || line.includes('Target')
                        ? 'font-bold'
                        : ''
                    }
                    style={
                      line.includes('LAT') || line.includes('LON')
                        ? { color: '#ec9796' }
                        : {}
                    }
                  >
                    {line}
                  </div>
                ))}
                {isHovered && !typingComplete && (
                  <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 align-middle" />
                )}
              </div>

              {/* Danger Banner */}
              <div
                className={`absolute bottom-0 left-0 w-full p-4 transition-all duration-500 delay-700 ${
                  typingComplete ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
                style={{ backgroundColor: 'rgba(238, 125, 119, 0.12)', borderTop: '1px solid rgba(238, 125, 119, 0.35)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined" style={{ color: '#ee7d77' }}>shield</span>
                  <div className="text-left">
                    <p className="font-bold text-sm" style={{ color: '#ee7d77' }}>
                      CRITICAL PRIVACY LEAK DETECTED
                    </p>
                    <p className="text-xs font-mono" style={{ color: '#ec9796' }}>
                      14 metadata tags found. Location exposed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-on-surface-variant/50 mt-4 italic">
            Hover over the image to simulate an EXIF extraction
          </p>
        </div>

        {/* Apple-Style Glass CTA Button */}
        <button
          onClick={handleEnter}
          className="group relative mt-4 px-10 py-5 rounded-2xl text-lg font-semibold tracking-tight transition-all duration-500 ease-out transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, rgba(169, 206, 204, 0.15) 0%, rgba(169, 206, 204, 0.05) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(169, 206, 204, 0.2)',
            boxShadow: '0 0 0 0.5px rgba(169, 206, 204, 0.1) inset, 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(169, 206, 204, 0.06)',
            color: '#c4eae8',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(169, 206, 204, 0.25) 0%, rgba(169, 206, 204, 0.1) 100%)';
            e.currentTarget.style.borderColor = 'rgba(169, 206, 204, 0.35)';
            e.currentTarget.style.boxShadow = '0 0 0 0.5px rgba(169, 206, 204, 0.15) inset, 0 12px 48px rgba(0, 0, 0, 0.4), 0 0 80px rgba(169, 206, 204, 0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(169, 206, 204, 0.15) 0%, rgba(169, 206, 204, 0.05) 100%)';
            e.currentTarget.style.borderColor = 'rgba(169, 206, 204, 0.2)';
            e.currentTarget.style.boxShadow = '0 0 0 0.5px rgba(169, 206, 204, 0.1) inset, 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(169, 206, 204, 0.06)';
          }}
        >
          {/* Glass highlight sheen */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, transparent 100%)',
            }}
          />
          <span className="relative flex items-center gap-3">
            Scrub your photos now
            <span className="material-symbols-outlined text-xl transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
          </span>
        </button>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-2">
          {[
            { icon: 'cloud_off', label: 'Zero Uploads' },
            { icon: 'lock', label: 'End-to-End Local' },
            { icon: 'speed', label: 'Instant Processing' },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2 text-on-surface-variant/40">
              <span className="material-symbols-outlined text-sm">{badge.icon}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
