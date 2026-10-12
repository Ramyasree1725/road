import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Compass } from 'lucide-react';

// Fix standard Leaflet default icon asset URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export const MapPicker = ({
  coordinates = [80.2707, 13.0827], // [lng, lat]
  onCoordinatesChange,
  address,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [detecting, setDetecting] = useState(false);

  const lat = coordinates[1] || 13.0827;
  const lng = coordinates[0] || 80.2707;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([lat, lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current = marker;

      marker.on('dragend', (e) => {
        const position = e.target.getLatLng();
        if (onCoordinatesChange) {
          onCoordinatesChange([Number(position.lng.toFixed(5)), Number(position.lat.toFixed(5))]);
        }
      });

      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        if (onCoordinatesChange) {
          onCoordinatesChange([Number(e.latlng.lng.toFixed(5)), Number(e.latlng.lat.toFixed(5))]);
        }
      });

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([lat, lng]);
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker position if coordinates prop updates externally
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (currentPos.lat !== lat || currentPos.lng !== lng) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.panTo([lat, lng]);
      }
    }
  }, [lat, lng]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetecting(false);
        const userLat = Number(pos.coords.latitude.toFixed(5));
        const userLng = Number(pos.coords.longitude.toFixed(5));
        if (onCoordinatesChange) {
          onCoordinatesChange([userLng, userLat]);
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([userLat, userLng], 15);
        }
      },
      (err) => {
        setDetecting(false);
        console.warn('Geolocation error:', err.message);
        alert('Could not retrieve your exact location. You can click on the map to place the pin.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
        <span className="flex items-center gap-1 font-medium text-emerald-800">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          Click or drag marker to set exact issue location
        </span>
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={detecting}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors"
        >
          <Navigation className={`w-3.5 h-3.5 ${detecting ? 'animate-spin' : ''}`} />
          {detecting ? 'Locating...' : 'Use My GPS'}
        </button>
      </div>

      <div className="relative w-full h-64 border border-slate-300 rounded-xl overflow-hidden shadow-xs">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-mono">
        <span className="flex items-center gap-1 text-slate-500">
          <Compass className="w-3.5 h-3.5" />
          Coordinates:
        </span>
        <span className="font-semibold text-emerald-800">
          Lat: {lat}, Lng: {lng}
        </span>
      </div>
    </div>
  );
};

export default MapPicker;
