
import React, { useState, useEffect } from 'react';
import { Map, MapPin } from 'lucide-react';

interface LocationMapPickerV2Props {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  isLoading?: boolean;
}

export function LocationMapPickerV2({
  latitude,
  longitude,
  onLocationChange,
  isLoading
}: LocationMapPickerV2Props) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  // Load Leaflet dynamically to avoid SSR issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Add Leaflet CSS
      const linkEl = document.createElement('link');
      linkEl.rel = 'stylesheet';
      linkEl.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      linkEl.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      linkEl.crossOrigin = '';
      document.head.appendChild(linkEl);

      // Import Leaflet
      import('leaflet').then((L) => {
        setMapLoaded(true);
      });
    }
  }, []);

  // Initialize map once Leaflet is loaded
  useEffect(() => {
    if (!mapLoaded) return;

    const L = require('leaflet');
    
    // Get DOM element
    const mapContainer = document.getElementById('location-map');
    if (!mapContainer) return;

    // Set default coordinates if none provided
    const defaultLat = latitude || -23.550520;
    const defaultLng = longitude || -46.633309;

    // Initialize map
    const mapInstance = L.map('location-map', {
      center: [defaultLat, defaultLng],
      zoom: 13
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstance);

    // Add marker
    const markerInstance = L.marker([defaultLat, defaultLng], {
      draggable: !isLoading
    }).addTo(mapInstance);

    // Handle marker drag
    markerInstance.on('dragend', function(e: any) {
      const position = e.target.getLatLng();
      onLocationChange(position.lat, position.lng);
    });

    // Handle map click
    mapInstance.on('click', function(e: any) {
      if (isLoading) return;
      
      const { lat, lng } = e.latlng;
      markerInstance.setLatLng([lat, lng]);
      onLocationChange(lat, lng);
    });

    // Save instances for later use
    setMap(mapInstance);
    setMarker(markerInstance);

    // Cleanup
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [mapLoaded, isLoading]);

  // Update marker position when lat/lng props change
  useEffect(() => {
    if (marker && map && latitude && longitude) {
      marker.setLatLng([latitude, longitude]);
      map.setView([latitude, longitude]);
    }
  }, [latitude, longitude, marker, map]);

  if (!mapLoaded) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-100 rounded-lg">
        <Map className="h-8 w-8 text-gray-400 mr-2" />
        <span>Carregando mapa...</span>
      </div>
    );
  }

  return (
    <div className="h-[300px] rounded-lg overflow-hidden border">
      <div id="location-map" className="h-full w-full"></div>
    </div>
  );
}
