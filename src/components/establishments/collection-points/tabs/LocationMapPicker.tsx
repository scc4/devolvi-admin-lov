
import { useState } from 'react';
import type { CollectionPoint } from '@/types/collection-point';
import { MapboxTokenInput } from './address/map/MapboxTokenInput';
import { MapComponent } from './address/map/MapComponent';

interface LocationMapPickerProps {
  form: Partial<CollectionPoint>;
  onLocationChange: (lat: number, lng: number) => void;
  isLoading?: boolean;
}

export function LocationMapPicker({ form, onLocationChange, isLoading }: LocationMapPickerProps) {
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
    setShowTokenInput(false);
  };

  if (showTokenInput) {
    return <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />;
  }

  return (
    <MapComponent
      mapboxToken={mapboxToken}
      initialLatitude={form.latitude}
      initialLongitude={form.longitude}
      onLocationChange={onLocationChange}
    />
  );
}
