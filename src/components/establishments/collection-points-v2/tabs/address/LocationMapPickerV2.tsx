
import React, { useState, useEffect } from 'react';
import { Map, MapPin } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { lazy, Suspense } from 'react';

// Lazy load Leaflet to avoid SSR issues
const MapComponent = lazy(() => 
  import('./map/MapComponentV2').then(module => ({ default: module.MapComponentV2 }))
);

interface LocationMapPickerV2Props {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
  isLoading?: boolean;
}

export function LocationMapPickerV2({
  latitude,
  longitude,
  onLocationChange,
  isLoading
}: LocationMapPickerV2Props) {
  if (isLoading) {
    return (
      <Skeleton className="h-[300px] w-full rounded-lg" />
    );
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[300px] bg-muted rounded-lg">
        <Map className="h-8 w-8 text-muted-foreground mr-2" />
        <span>Carregando mapa...</span>
      </div>
    }>
      <MapComponent 
        initialLatitude={latitude} 
        initialLongitude={longitude}
        onLocationChange={onLocationChange}
      />
    </Suspense>
  );
}
