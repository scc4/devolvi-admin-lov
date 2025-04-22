
import { lazy, Suspense } from 'react';
import type { CollectionPoint } from '@/types/collection-point';
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the heavy MapComponent
const MapComponent = lazy(() => 
  import('./address/map/MapComponent').then(module => ({ default: module.MapComponent }))
);

interface LocationMapPickerProps {
  form: Partial<CollectionPoint>;
  onLocationChange: (lat: number, lng: number) => void;
  isLoading?: boolean;
}

export function LocationMapPicker({ form, onLocationChange, isLoading }: LocationMapPickerProps) {
  return (
    <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-lg" />}>
      <MapComponent
        initialLatitude={form.latitude}
        initialLongitude={form.longitude}
        onLocationChange={onLocationChange}
      />
    </Suspense>
  );
}
