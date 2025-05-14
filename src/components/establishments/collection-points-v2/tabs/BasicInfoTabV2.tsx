
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { CollectionPoint } from "@/types/collection-point";

interface BasicInfoTabProps {
  formState: Partial<CollectionPoint>;
  updateFormField: (field: string, value: any) => void;
  pudoMode?: boolean;
}

export function BasicInfoTabV2({ 
  formState, 
  updateFormField,
  pudoMode = false
}: BasicInfoTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Ponto de Coleta</Label>
          <Input
            id="name"
            placeholder="Digite o nome do ponto"
            value={formState.name || ""}
            onChange={(e) => updateFormField("name", e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            placeholder="(00) 00000-0000"
            value={formState.phone || ""}
            onChange={(e) => updateFormField("phone", e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={formState.is_active ?? true}
            onCheckedChange={(checked) => updateFormField("is_active", checked)}
          />
          <Label htmlFor="is_active">Ponto ativo</Label>
        </div>
        
        {!pudoMode && (
          <div className="flex items-center space-x-2">
            <Switch
              id="pudo"
              checked={formState.pudo ?? false}
              onCheckedChange={(checked) => updateFormField("pudo", checked)}
            />
            <Label htmlFor="pudo">Ponto PUDO (Pick Up Drop Off)</Label>
          </div>
        )}
        {pudoMode && (
          <div className="text-sm text-muted-foreground mt-2">
            Este é um ponto PUDO (Pick Up Drop Off) para coleta e entrega de produtos.
          </div>
        )}
      </div>
    </div>
  );
}
