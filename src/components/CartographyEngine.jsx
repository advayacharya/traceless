import React, { useEffect, useRef, useMemo } from 'react';

/**
 * CartographyEngine — Renders a Leaflet map showing GPS coordinates.
 * If no GPS data is present, shows a green "No Location Data Found" badge.
 */
export default function CartographyEngine({ location, hasGps }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const coords = useMemo(() => {
    if (!hasGps || !location) return null;
    return {
      lat: location.latitude,
      lng: location.longitude,
    };
  }, [hasGps, location]);

  useEffect(() => {
    // Only import leaflet on the client
    let L;
    const initMap = async () => {
      L = await import('leaflet');
      // Fix default marker icon paths for bundlers
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([0, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Create a custom red icon
      const redIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      if (coords) {
        map.flyTo([coords.lat, coords.lng], 14, { duration: 1.5 });
        markerRef.current = L.marker([coords.lat, coords.lng], { icon: redIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
              <strong>GPS Trace</strong><br/>
              Lat: ${coords.lat.toFixed(6)}<br/>
              Lng: ${coords.lng.toFixed(6)}
            </div>`
          )
          .openPopup();
      }
    };

    if (hasGps && coords) {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [coords, hasGps]);

  // No GPS — show badge
  if (!hasGps) {
    return (
      <div className="bg-surface-container-low p-4 rounded-sm border border-outline-variant/5">
        <div className="flex items-center justify-center gap-3 py-6">
          <span className="material-symbols-outlined text-secondary text-xl">check_circle</span>
          <span className="font-mono text-xs uppercase tracking-widest text-secondary">
            No Location Data Found — Asset is Clean
          </span>
        </div>
      </div>
    );
  }

  // Has GPS — render map
  return (
    <div className="bg-surface-container-low p-1 rounded-sm border border-outline-variant/5">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-sm">location_on</span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface">Geolocation Trace</span>
        </div>
        {coords && (
          <span className="font-mono text-[10px] text-on-surface-variant">
            {coords.lat.toFixed(4)}° {coords.lat >= 0 ? 'N' : 'S'},{' '}
            {Math.abs(coords.lng).toFixed(4)}° {coords.lng >= 0 ? 'E' : 'W'}
          </span>
        )}
      </div>
      <div
        ref={mapContainerRef}
        className="h-48 bg-surface-container-lowest relative overflow-hidden"
        style={{ zIndex: 0 }}
      />
    </div>
  );
}
