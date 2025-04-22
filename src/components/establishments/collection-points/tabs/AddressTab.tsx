
import { Label } from "@/components/ui/label";
import type { CollectionPoint } from "@/types/collection-point";
import { LocationMapPicker } from './LocationMapPicker';
import { useAddressForm } from "@/hooks/useAddressForm";
import { BasicAddressFields } from "./address/BasicAddressFields";
import { LocationFields } from "./address/LocationFields";
import { CoordinatesFields } from "./address/CoordinatesFields";

interface AddressTabProps {
  form: Partial<CollectionPoint>;
  onInputChange: (field: keyof CollectionPoint, value: any) => void;
  isLoading?: boolean;
}

export function AddressTab({ form, onInputChange, isLoading }: AddressTabProps) {
  const {
    states,
    availableCities,
    isLoadingCities,
    handleCEPChange
  } = useAddressForm(form, onInputChange);

  const handleLocationChange = (lat: number, lng: number) => {
    onInputChange('latitude', lat);
    onInputChange('longitude', lng);
  };

  return (
    <div className="space-y-4">
      <BasicAddressFields 
        form={form} 
        onInputChange={onInputChange} 
        isLoading={isLoading} 
      />

      <LocationFields
        form={form}
        onInputChange={onInputChange}
        states={states}
        availableCities={availableCities}
        isLoadingCities={isLoadingCities}
        isLoading={isLoading}
        handleCEPChange={handleCEPChange}
      />

      <div className="space-y-2">
        <Label>Localização no Mapa</Label>
        <LocationMapPicker
          form={form}
          onLocationChange={handleLocationChange}
          isLoading={isLoading}
        />
      </div>

      <CoordinatesFields 
        form={form} 
        onInputChange={onInputChange} 
        isLoading={isLoading} 
      />
    </div>
  );
}
