
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MapboxTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

export function MapboxTokenInput({ onTokenSubmit }: MapboxTokenInputProps) {
  const [mapboxToken, setMapboxToken] = useState<string>('');

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
          onClick={() => onTokenSubmit(mapboxToken)}
          disabled={!mapboxToken}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
