
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CollectionPoint } from "@/types/collection-point";

interface BasicAddressFieldsProps {
  form: Partial<CollectionPoint>;
  onInputChange: (field: keyof CollectionPoint, value: any) => void;
  isLoading?: boolean;
}

export function BasicAddressFields({ form, onInputChange, isLoading }: BasicAddressFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="street">Rua</Label>
          <Input
            id="street"
            placeholder="Rua"
            value={form.street || ''}
            onChange={(e) => onInputChange('street', e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            placeholder="Número"
            value={form.number || ''}
            onChange={(e) => onInputChange('number', e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            placeholder="Complemento"
            value={form.complement || ''}
            onChange={(e) => onInputChange('complement', e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">Bairro</Label>
          <Input
            id="district"
            placeholder="Bairro"
            value={form.district || ''}
            onChange={(e) => onInputChange('district', e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
      {/* O campo de Endereço Completo foi removido conforme solicitado */}
    </>
  );
}

