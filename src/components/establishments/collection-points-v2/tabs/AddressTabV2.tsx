
import { useAddressFormV2 } from "@/hooks/useAddressFormV2";
import { BasicAddressFieldsV2 } from "./address/BasicAddressFieldsV2";
import { LocationFieldsV2 } from "./address/LocationFieldsV2";
import { CoordinatesFieldsV2 } from "./address/CoordinatesFieldsV2";
import { LocationMapPickerV2 } from "./address/LocationMapPickerV2";
import type { CollectionPoint, Address } from "@/types/collection-point";

interface AddressTabV2Props {
  form: Partial<CollectionPoint> & { address_obj?: Address | null };
  onInputChange: (field: keyof Address, value: any) => void;
  isLoading?: boolean;
}

export function AddressTabV2({ form, onInputChange, isLoading }: AddressTabV2Props) {
  const { states, availableCities, isLoadingCities, handleCEPChange } = useAddressFormV2(form, onInputChange);

  return (
    <div className="space-y-6">
      <BasicAddressFieldsV2 form={form} onInputChange={onInputChange} isLoading={isLoading} />
      
      <LocationFieldsV2 
        form={form} 
        onInputChange={onInputChange} 
        isLoading={isLoading || isLoadingCities}
        states={states}
        availableCities={availableCities}
        handleCEPChange={handleCEPChange}
      />
      
      <CoordinatesFieldsV2 form={form} onInputChange={onInputChange} isLoading={isLoading} />
      
      <div className="mt-6">
        <div className="font-medium mb-2">Mapa</div>
        <LocationMapPickerV2 
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
