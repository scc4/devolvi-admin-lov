
import { useEffect, useRef, lazy, Suspense } from 'react';
import { MapPin } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load Leaflet only when component mounts
const loadLeaflet = async () => {
  const L = await import('leaflet');
  await import('leaflet/dist/leaflet.css');
  return L.default || L;
};

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
  const map = useRef<any | null>(null);
  const marker = useRef<any | null>(null);
  const leafletLoaded = useRef<boolean>(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Only load the map if the component is mounted
    let isMounted = true;
    
    const initializeMap = async () => {
      if (!isMounted) return;
      
      const L = await loadLeaflet();
      if (!isMounted || leafletLoaded.current) return;
      
      leafletLoaded.current = true;
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
          marker.current = L.marker([lat, lng]).addTo(map.current);
        }
        
        onLocationChange(lat, lng);
      });
    };

    initializeMap();

    return () => {
      isMounted = false;
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
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
