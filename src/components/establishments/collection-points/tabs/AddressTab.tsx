
import { useAddressForm } from "@/hooks/useAddressForm";
import { BasicAddressFields } from "./address/BasicAddressFields";
import { CoordinatesFields } from "./address/CoordinatesFields";
import { LocationFields } from "./address/LocationFields";
import { LocationMapPicker } from "./LocationMapPicker";
import type { CollectionPoint, Address } from "@/types/collection-point";

interface AddressTabProps {
  form: Partial<CollectionPoint> & { address_obj?: Address | null };
  onInputChange: (field: keyof Address, value: any) => void;
  isLoading?: boolean;
}

export function AddressTab({ form, onInputChange, isLoading }: AddressTabProps) {
  // Pass the entire form
  const { states, availableCities, isLoadingCities, handleCEPChange } = useAddressForm(form, onInputChange);

  return (
    <div className="space-y-6">
      <BasicAddressFields form={form} onInputChange={onInputChange} isLoading={isLoading} />
      
      <LocationFields 
        form={form} 
        onInputChange={onInputChange} 
        isLoading={isLoading || isLoadingCities}
        states={states}
        availableCities={availableCities}
        handleCEPChange={handleCEPChange}
      />
      
      <CoordinatesFields form={form} onInputChange={onInputChange} isLoading={isLoading} />
      
      <div className="mt-6">
        <div className="font-medium mb-2">Mapa</div>
        <LocationMapPicker 
          latitude={form.address_obj?.latitude || null} 
          longitude={form.address_obj?.longitude || null}
          onLocationChange={(lat, lng) => {
            onInputChange('latitude', lat);
            onInputChange('longitude', lng);
          }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
