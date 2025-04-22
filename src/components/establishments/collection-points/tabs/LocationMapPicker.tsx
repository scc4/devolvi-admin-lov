
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollectionPoint } from '@/types/collection-point';

interface LocationMapPickerProps {
  form: Partial<CollectionPoint>;
  onLocationChange: (lat: number, lng: number) => void;
  isLoading?: boolean;
}

export function LocationMapPicker({ form, onLocationChange, isLoading }: LocationMapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    // Initialize map with Brazil's center coordinates
    const initialLatitude = form.latitude || -14.235;
    const initialLongitude = form.longitude || -51.925;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialLongitude, initialLatitude],
      zoom: 4
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker if coordinates exist
    if (form.latitude && form.longitude) {
      marker.current = new mapboxgl.Marker()
        .setLngLat([form.longitude, form.latitude])
        .addTo(map.current);
    }

    // Handle click events to update marker
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
  }, [mapboxToken, form.latitude, form.longitude]);

  if (showTokenInput) {
    return (
      <div className="space-y-4 p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground">
          Para usar o mapa, insira seu token público do Mapbox. 
          Você pode obtê-lo em <a href="https://www.mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border rounded-md"
            placeholder="Cole seu token público do Mapbox aqui"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <Button 
            onClick={() => setShowTokenInput(false)}
            disabled={!mapboxToken}
          >
            Confirmar
          </Button>
        </div>
      </div>
    );
  }

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
