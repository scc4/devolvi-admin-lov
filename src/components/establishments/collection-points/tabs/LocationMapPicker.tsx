
import { lazy, Suspense } from 'react';
import type { CollectionPoint, Address } from '@/types/collection-point';
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the heavy MapComponent
const MapComponent = lazy(() => 
  import('./address/map/MapComponent').then(module => ({ default: module.MapComponent }))
);

interface LocationMapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  isLoading?: boolean;
}

export function LocationMapPicker({ latitude, longitude, onLocationChange, isLoading }: LocationMapPickerProps) {
  return (
    <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-lg" />}>
      <div className="flex flex-col gap-4">
        <MapComponent
          initialLatitude={latitude}
          initialLongitude={longitude}
          onLocationChange={onLocationChange}
        />
      </div>
    </Suspense>
  );
}
