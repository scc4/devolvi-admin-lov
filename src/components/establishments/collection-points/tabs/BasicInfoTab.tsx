
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { CollectionPoint } from "@/types/collection-point";

interface BasicInfoTabProps {
  form: Partial<CollectionPoint>;
  onInputChange: (field: keyof CollectionPoint, value: any) => void;
  isLoading?: boolean;
}

export function BasicInfoTab({ form, onInputChange, isLoading }: BasicInfoTabProps) {
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
          className="h-12 md:h-10" // Taller on mobile for better touch target
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="Telefone de contato"
          type="tel" // Better mobile keyboard for phone numbers
          inputMode="tel" // Better mobile keyboard for phone numbers
          value={form.phone || ''}
          onChange={(e) => onInputChange('phone', e.target.value)}
          disabled={isLoading}
          className="h-12 md:h-10" // Taller on mobile for better touch target
        />
      </div>

      <div className="flex items-center space-x-2 py-2">
        <Switch 
          id="is_active" 
          checked={form.is_active || false}
          onCheckedChange={(checked) => onInputChange('is_active', checked)}
          disabled={isLoading}
          className="data-[state=checked]:bg-green-600" // Green for better visual indication
        />
        <Label htmlFor="is_active" className="text-base md:text-sm">Ponto de coleta ativo</Label>
      </div>
    </div>
  );
}
