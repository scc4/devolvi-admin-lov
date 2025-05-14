
import { useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentV2Props {
  initialLatitude?: number | null;
  initialLongitude?: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

export function MapComponentV2({
  initialLatitude,
  initialLongitude,
  onLocationChange
}: MapComponentV2Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;
    
    // Default coordinates (Brazil center) if none provided
    const latitude = initialLatitude || -14.235;
    const longitude = initialLongitude || -51.925;
    const zoomLevel = initialLatitude && initialLongitude ? 15 : 4;

    // Initialize map
    const map = L.map(mapContainer.current).setView([latitude, longitude], zoomLevel);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add zoom control
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initialize marker if coordinates are provided
    if (initialLatitude && initialLongitude) {
      markerRef.current = L.marker([initialLatitude, initialLongitude], {
        draggable: true
      }).addTo(map);
      
      // Handle marker drag
      markerRef.current.on('dragend', function(e) {
        const marker = e.target;
        const position = marker.getLatLng();
        onLocationChange(position.lat, position.lng);
      });
    }

    // Handle map clicks to place/move marker
    map.on('click', function(e) {
      const { lat, lng } = e.latlng;
      
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          draggable: true
        }).addTo(map);
        
        markerRef.current.on('dragend', function(e) {
          const marker = e.target;
          const position = marker.getLatLng();
          onLocationChange(position.lat, position.lng);
        });
      }
      
      onLocationChange(lat, lng);
    });

    // Store map instance for cleanup
    mapInstance.current = map;

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerRef.current = null;
      }
    };
  }, [initialLatitude, initialLongitude, onLocationChange]);

  return (
    <div className="space-y-4">
      <div className="h-[300px] relative rounded-lg overflow-hidden border">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Clique no mapa para definir a localização do ponto
      </p>
    </div>
  );
}
