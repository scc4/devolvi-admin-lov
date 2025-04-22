
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { maskPhoneBR } from "@/lib/format";
import type { CollectionPoint } from "@/types/collection-point";

interface BasicInfoTabProps {
  form: Partial<CollectionPoint>;
  onInputChange: (field: keyof CollectionPoint, value: any) => void;
  isLoading?: boolean;
}

export function BasicInfoTab({ form, onInputChange, isLoading }: BasicInfoTabProps) {
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhoneBR(e.target.value);
    onInputChange('phone', maskedValue);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Ponto de Coleta *</Label>
        <Input
          id="name"
          placeholder="Nome do ponto de coleta"
          value={form.name || ''}
          onChange={(e) => onInputChange('name', e.target.value)}
          disabled={isLoading}
          className="h-12 md:h-10"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="(00) 00000-0000"
          type="tel"
          inputMode="tel"
          value={form.phone || ''}
          onChange={handlePhoneChange}
          disabled={isLoading}
          className="h-12 md:h-10"
          maxLength={15}
        />
      </div>

      <div className="flex items-center space-x-2 py-2">
        <Checkbox 
          id="is_active" 
          checked={form.is_active || false}
          onCheckedChange={(checked) => onInputChange('is_active', checked === true)}
          disabled={isLoading}
        />
        <Label htmlFor="is_active" className="text-base md:text-sm">Ponto de coleta ativo</Label>
      </div>
    </div>
  );
}

