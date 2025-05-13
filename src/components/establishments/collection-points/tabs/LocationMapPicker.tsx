
import { lazy, Suspense } from 'react';
import type { CollectionPoint, Address } from '@/types/collection-point';
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the heavy MapComponent
const MapComponent = lazy(() => 
  import('./address/map/MapComponent').then(module => ({ default: module.MapComponent }))
);
import { CoordinatesFields } from './address/CoordinatesFields';

interface LocationMapPickerProps {
  form: Partial<CollectionPoint> & { address?: Partial<Address> };
  onLocationChange: (lat: number, lng: number) => void;
  isLoading?: boolean;
}

export function LocationMapPicker({ form, onLocationChange, isLoading }: LocationMapPickerProps) {
  return (
    <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-lg" />}>
      <div className="flex flex-col gap-4">
        <MapComponent
          initialLatitude={form.address?.latitude}
          initialLongitude={form.address?.longitude}
          onLocationChange={onLocationChange}
        />
        {/* Inputs de latitude e longitude agora abaixo do mapa */}
        <CoordinatesFields
          form={form}
          onInputChange={onLocationChangeFields(onLocationChange)}
          isLoading={isLoading}
        />
      </div>
    </Suspense>
  );
}

// Função utilitária para adaptar o onLocationChange aos campos de latitude/longitude do input
function onLocationChangeFields(onLocationChange: (lat: number, lng: number) => void) {
  return (field: keyof Address, value: number | null) => {
    if (field === "latitude") {
      onLocationChange(value ?? 0, null as any);
    } else if (field === "longitude") {
      onLocationChange(null as any, value ?? 0);
    }
  };
}
