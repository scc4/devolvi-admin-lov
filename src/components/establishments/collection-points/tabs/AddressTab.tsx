
import { Label } from "@/components/ui/label";
import type { CollectionPoint } from "@/types/collection-point";
import { LocationMapPicker } from './LocationMapPicker';
import { useAddressForm } from "@/hooks/useAddressForm";
import { BasicAddressFields } from "./address/BasicAddressFields";
import { LocationFields } from "./address/LocationFields";
import { CoordinatesFields } from "./address/CoordinatesFields";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    <Tabs defaultValue="address" className="space-y-4 h-full">
      <TabsList className="mb-2">
        <TabsTrigger value="address">Endereço</TabsTrigger>
        <TabsTrigger value="map">Mapa</TabsTrigger>
      </TabsList>

      <TabsContent value="address" className="h-full overflow-auto">
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

          <CoordinatesFields 
            form={form} 
            onInputChange={onInputChange} 
            isLoading={isLoading} 
          />
        </div>
      </TabsContent>

      <TabsContent value="map" className="h-full">
        <div className="space-y-2 h-full">
          <Label>Localização no Mapa</Label>
          <div className="h-[calc(100%-2rem)]">
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
