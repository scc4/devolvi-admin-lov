
import { Label } from "@/components/ui/label";
import type { CollectionPoint, Address } from "@/types/collection-point";
import { LocationMapPicker } from './LocationMapPicker';
import { useAddressForm } from "@/hooks/useAddressForm";
import { BasicAddressFields } from "./address/BasicAddressFields";
import { LocationFields } from "./address/LocationFields";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface AddressTabProps {
  form: Partial<CollectionPoint> & { address?: Partial<Address> };
  onInputChange: (field: keyof Address, value: any) => void;
  isLoading?: boolean;
}

export function AddressTab({ form, onInputChange, isLoading }: AddressTabProps) {
  const { isMobile } = useIsMobile();
  
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
    <Tabs defaultValue="address" className="h-full flex flex-col">
      <TabsList className={`mb-2 w-full ${isMobile ? "grid grid-cols-1 gap-1" : "flex"}`}>
        <TabsTrigger value="address" className={isMobile ? "w-full" : "flex-1"}>Endereço</TabsTrigger>
        <TabsTrigger value="map" className={isMobile ? "w-full" : "flex-1"}>Mapa</TabsTrigger>
      </TabsList>

      <TabsContent value="address" className="flex-1 overflow-auto">
        <div className="space-y-4 pb-2">
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
        </div>
      </TabsContent>

      <TabsContent value="map" className="flex-1 mt-0">
        <div className="h-full flex flex-col gap-4">
          <Label className="mb-2">Localização no Mapa</Label>
          <div className="flex-1 min-h-[300px]">
            <LocationMapPicker
              form={form}
              onLocationChange={handleLocationChange}
              isLoading={isLoading}
            />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
