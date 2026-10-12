import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Link } from 'react-router-dom';

export const PublicMap = ({ complaints = [], selectedComplaint, onSelectComplaint }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView([13.0827, 80.2707], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when complaints change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const bounds = [];

    complaints.forEach((c) => {
      const coords = c.location?.coordinates || [80.2707, 13.0827];
      const lng = coords[0];
      const lat = coords[1];

      if (!lat || !lng) return;

      bounds.push([lat, lng]);

      // Category color marker
      const isResolved = ['RESOLVED', 'CLOSED'].includes(c.status);
      const isCritical = c.priority === 'CRITICAL';
      const markerColor = isResolved ? '#16a34a' : isCritical ? '#dc2626' : '#0284c7';

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
          background-color: ${markerColor};
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 11px;
          font-weight: bold;
        ">📍</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(markersLayerRef.current);

      const popupContent = `
        <div style="min-width: 200px; padding: 4px; font-family: sans-serif;">
          <div style="font-size: 11px; font-weight: bold; color: #059669; text-transform: uppercase;">
            ${c.ticketId} • ${c.category}
          </div>
          <h4 style="font-size: 13px; font-weight: 600; margin: 4px 0; color: #1e293b;">
            ${c.title}
          </h4>
          <p style="font-size: 11px; color: #64748b; margin: 2px 0;">
            📍 ${c.location?.address || 'City Location'}
          </p>
          <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span style="
              font-size: 10px;
              padding: 2px 6px;
              border-radius: 9999px;
              font-weight: 600;
              background: ${isResolved ? '#dcfce7' : '#e0f2fe'};
              color: ${isResolved ? '#166534' : '#0369a1'};
            ">${c.status}</span>
            <a href="/track?id=${c.ticketId}" style="
              font-size: 11px;
              color: #059669;
              font-weight: bold;
              text-decoration: underline;
            ">Track Status &rarr;</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectComplaint) {
          onSelectComplaint(c);
        }
      });
    });

    if (bounds.length > 0 && mapInstanceRef.current) {
      try {
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } catch (e) {
        // bounds fit fallback
      }
    }
  }, [complaints]);

  // Center on selected complaint if passed
  useEffect(() => {
    if (selectedComplaint && mapInstanceRef.current) {
      const coords = selectedComplaint.location?.coordinates;
      if (coords && coords.length === 2) {
        mapInstanceRef.current.flyTo([coords[1], coords[0]], 16);
      }
    }
  }, [selectedComplaint]);

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden border border-slate-200 shadow-md">
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />
      
      {/* Map Legend Overlay */}
      <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-xs p-3 rounded-xl shadow-lg border border-slate-200 text-xs space-y-1.5 pointer-events-auto">
        <div className="font-bold text-slate-800 border-b pb-1 text-[11px] uppercase tracking-wider">
          Map Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white shadow-xs"></span>
          <span className="text-slate-600">Resolved / Closed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-sky-600 border border-white shadow-xs"></span>
          <span className="text-slate-600">In Progress / Active</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-600 border border-white shadow-xs"></span>
          <span className="text-slate-600">Critical Priority</span>
        </div>
      </div>
    </div>
  );
};

export default PublicMap;
