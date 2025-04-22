
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';

interface MapComponentProps {
  mapboxToken: string;
  initialLatitude?: number | null;
  initialLongitude?: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

export function MapComponent({ 
  mapboxToken, 
  initialLatitude, 
  initialLongitude, 
  onLocationChange 
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    const latitude = initialLatitude || -14.235;
    const longitude = initialLongitude || -51.925;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 4
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    if (initialLatitude && initialLongitude) {
      marker.current = new mapboxgl.Marker()
        .setLngLat([initialLongitude, initialLatitude])
        .addTo(map.current);
    }

    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      
      if (marker.current) {
        marker.current.setLngLat([lng, lat]);
      } else {
        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current!);
      }
      
      onLocationChange(lat, lng);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, initialLatitude, initialLongitude]);

  return (
    <div className="space-y-4">
      <div className="h-[400px] relative rounded-lg overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Clique no mapa para definir a localização do ponto de coleta
      </p>
    </div>
  );
}
