
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CollectionPoint, Address } from "@/types/collection-point";
import { maskCEP } from "@/lib/format";

interface LocationFieldsProps {
  form: Partial<CollectionPoint> & { address?: Partial<Address> };
  onInputChange: (field: keyof Address, value: any) => void;
  states: { value: string; label: string; }[];
  availableCities: string[];
  isLoadingCities: boolean;
  isLoading?: boolean;
  handleCEPChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LocationFields({
  form,
  onInputChange,
  states,
  availableCities,
  isLoadingCities,
  isLoading,
  handleCEPChange
}: LocationFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zip_code">CEP</Label>
          <Input
            id="zip_code"
            placeholder="00000-000"
            value={form.address?.zip_code || ''}
            onChange={handleCEPChange}
            disabled={isLoading}
            maxLength={9}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Select
            value={form.address?.state || ''}
            onValueChange={(value) => onInputChange('state', value)}
            disabled={isLoading || !states.length}
          >
            <SelectTrigger id="state">
              <SelectValue placeholder={states.length ? "Selecione o estado" : "Carregando estados..."} />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Select
            value={form.address?.city || ''}
            onValueChange={(value) => onInputChange('city', value)}
            disabled={isLoading || !form.address?.state || isLoadingCities}
          >
            <SelectTrigger id="city">
              <SelectValue 
                placeholder={
                  isLoadingCities 
                    ? "Carregando cidades..." 
                    : form.address?.state 
                      ? "Selecione a cidade" 
                      : "Selecione um estado primeiro"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
