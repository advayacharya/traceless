import React, { useState, useEffect, useRef } from 'react';

/**
 * VantaBackground — Persistent animated 3D net mesh.
 * Renders as a full-screen fixed layer behind all app content.
 */
export default function VantaBackground() {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    const waitForGlobal = (name, maxWait = 5000) => {
      return new Promise((resolve) => {
        if (window[name]) { resolve(); return; }
        const start = Date.now();
        const check = () => {
          if (window[name] || Date.now() - start > maxWait) { resolve(); return; }
          setTimeout(check, 50);
        };
        check();
      });
    };

    const initVanta = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        await waitForGlobal('THREE');

        await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js');
        await waitForGlobal('VANTA');

        if (cancelled || !window.VANTA || !vantaRef.current) return;

        const effect = window.VANTA.NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xa9cecc,
          backgroundColor: 0x0c0e12,
          points: 12.0,
          maxDistance: 22.0,
          spacing: 18.0,
        });
        if (!cancelled) setVantaEffect(effect);
      } catch (err) {
        console.warn('Vanta.js init failed (non-critical):', err);
      }
    };

    if (!vantaEffect) initVanta();

    return () => {
      cancelled = true;
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
}
