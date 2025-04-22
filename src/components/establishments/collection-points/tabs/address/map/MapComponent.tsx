import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

interface MapComponentProps {
  initialLatitude?: number | null;
  initialLongitude?: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

export function MapComponent({ 
  initialLatitude, 
  initialLongitude, 
  onLocationChange 
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    const latitude = initialLatitude || -14.235;
    const longitude = initialLongitude || -51.925;
    const zoomLevel = initialLatitude && initialLongitude ? 15 : 4; // Higher zoom when editing

    // Initialize the map
    map.current = L.map(mapContainer.current).setView([latitude, longitude], zoomLevel);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Add zoom control
    L.control.zoom({ position: 'topright' }).addTo(map.current);

    // Initialize marker if coordinates are provided
    if (initialLatitude && initialLongitude) {
      marker.current = L.marker([initialLatitude, initialLongitude]).addTo(map.current);
    }

    // Handle map clicks
    map.current.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      if (marker.current) {
        marker.current.setLatLng([lat, lng]);
      } else {
        marker.current = L.marker([lat, lng]).addTo(map.current!);
      }
      
      onLocationChange(lat, lng);
    });

    return () => {
      map.current?.remove();
    };
  }, [initialLatitude, initialLongitude, onLocationChange]);

  return (
    <div className="space-y-4">
      <div className="h-[500px] relative rounded-lg overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Clique no mapa para definir a localização do ponto de coleta
      </p>
    </div>
  );
}
