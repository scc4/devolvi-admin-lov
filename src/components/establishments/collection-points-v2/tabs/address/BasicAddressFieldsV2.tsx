
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CollectionPoint, Address } from "@/types/collection-point";

interface BasicAddressFieldsV2Props {
  form: Partial<CollectionPoint> & { address_obj?: Address | null };
  onInputChange: (field: keyof Address, value: any) => void;
  isLoading?: boolean;
}

export function BasicAddressFieldsV2({ form, onInputChange, isLoading }: BasicAddressFieldsV2Props) {
  const address = form.address_obj || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="street">Rua</Label>
          <Input
            id="street"
            placeholder="Rua / Avenida"
            value={address.street || ''}
            onChange={(e) => onInputChange('street', e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            placeholder="Número"
            value={address.number || ''}
            onChange={(e) => onInputChange('number', e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            placeholder="Complemento"
            value={address.complement || ''}
            onChange={(e) => onInputChange('complement', e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="district">Bairro</Label>
          <Input
            id="district"
            placeholder="Bairro"
            value={address.district || ''}
            onChange={(e) => onInputChange('district', e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
