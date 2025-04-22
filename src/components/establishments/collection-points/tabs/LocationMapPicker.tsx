
import type { CollectionPoint } from '@/types/collection-point';
import { MapComponent } from './address/map/MapComponent';

interface LocationMapPickerProps {
  form: Partial<CollectionPoint>;
  onLocationChange: (lat: number, lng: number) => void;
  isLoading?: boolean;
}

export function LocationMapPicker({ form, onLocationChange, isLoading }: LocationMapPickerProps) {
  return (
    <MapComponent
      initialLatitude={form.latitude}
      initialLongitude={form.longitude}
      onLocationChange={onLocationChange}
    />
  );
}
