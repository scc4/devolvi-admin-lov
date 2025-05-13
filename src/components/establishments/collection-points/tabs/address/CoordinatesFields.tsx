
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CollectionPoint, Address } from "@/types/collection-point";

interface CoordinatesFieldsProps {
  form: Partial<CollectionPoint>;
  onInputChange: (field: keyof Address, value: any) => void;
  isLoading?: boolean;
}

export function CoordinatesFields({ form, onInputChange, isLoading }: CoordinatesFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="latitude">Latitude</Label>
        <Input
          id="latitude"
          type="number"
          placeholder="Latitude"
          value={form.address_obj?.latitude?.toString() || ''}
          onChange={(e) => onInputChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="longitude">Longitude</Label>
        <Input
          id="longitude"
          type="number"
          placeholder="Longitude"
          value={form.address_obj?.longitude?.toString() || ''}
          onChange={(e) => onInputChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
