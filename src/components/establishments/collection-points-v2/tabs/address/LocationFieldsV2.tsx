
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CollectionPoint, Address } from "@/types/collection-point";

interface LocationFieldsV2Props {
  form: Partial<CollectionPoint> & { address_obj?: Address | null };
  onInputChange: (field: keyof Address, value: any) => void;
  isLoading?: boolean;
  states: { value: string; label: string }[];
  availableCities: string[];
  handleCEPChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LocationFieldsV2({
  form,
  onInputChange,
  isLoading,
  states,
  availableCities,
  handleCEPChange
}: LocationFieldsV2Props) {
  const address = form.address_obj || {};

  return (
    <div>
      <h3 className="font-medium mb-3">Localização</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zip_code">CEP</Label>
          <Input
            id="zip_code"
            placeholder="00000-000"
            value={address.zip_code || ''}
            onChange={handleCEPChange}
            disabled={isLoading}
            maxLength={9}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Select
            value={address.state || ''}
            onValueChange={(value) => onInputChange('state', value)}
            disabled={isLoading}
          >
            <SelectTrigger id="state" className="h-10">
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent className="z-[100]">
              {states.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Select
            value={address.city || ''}
            onValueChange={(value) => onInputChange('city', value)}
            disabled={isLoading || !address.state}
          >
            <SelectTrigger id="city" className="h-10">
              <SelectValue placeholder={!address.state ? 'Selecione o estado primeiro' : 'Selecione a cidade'} />
            </SelectTrigger>
            <SelectContent className="z-[100]">
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
