
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CollectionPoint, Address } from "@/types/collection-point";

interface CoordinatesFieldsV2Props {
  form: Partial<CollectionPoint> & { address_obj?: Address | null };
  onInputChange: (field: keyof Address, value: any) => void;
  isLoading?: boolean;
}

export function CoordinatesFieldsV2({ form, onInputChange, isLoading }: CoordinatesFieldsV2Props) {
  // Ensure address is never an empty object by providing default values
  const address: Address = form.address_obj || {
    street: null,
    number: null,
    complement: null,
    district: null,
    city: null,
    state: null,
    zip_code: null,
    latitude: null,
    longitude: null
  };

  const handleLatitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value === '' ? null : parseFloat(value);
    onInputChange('latitude', numValue);
  };

  const handleLongitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value === '' ? null : parseFloat(value);
    onInputChange('longitude', numValue);
  };

  return (
    <div>
      <h3 className="font-medium mb-3">Coordenadas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="Ex: -23.550520"
            value={address.latitude ?? ''}
            onChange={handleLatitudeChange}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="Ex: -46.633309"
            value={address.longitude ?? ''}
            onChange={handleLongitudeChange}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
