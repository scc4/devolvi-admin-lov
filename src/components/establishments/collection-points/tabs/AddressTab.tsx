
import type { CollectionPoint } from "@/types/collection-point";
import { StreetAddressInputs } from "./address/StreetAddressInputs";
import { LocationSelector } from "./address/LocationSelector";
import { LocationInputs } from "./address/LocationInputs";

interface AddressTabProps {
  form: Partial<CollectionPoint>;
  onInputChange: (field: keyof CollectionPoint, value: any) => void;
  isLoading?: boolean;
}

export function AddressTab({ form, onInputChange, isLoading }: AddressTabProps) {
  return (
    <div className="space-y-4">
      <StreetAddressInputs 
        form={form} 
        onInputChange={onInputChange} 
        isLoading={isLoading} 
      />
      
      <LocationSelector 
        form={form} 
        onInputChange={onInputChange} 
        isLoading={isLoading} 
      />
      
      <LocationInputs 
        form={form} 
        onInputChange={onInputChange} 
        isLoading={isLoading} 
      />
    </div>
  );
}
