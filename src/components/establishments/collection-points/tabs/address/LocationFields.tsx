
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CollectionPoint, Address, AddressFormData } from "@/types/collection-point";

interface LocationFieldsProps {
  form: Partial<CollectionPoint> & { address_obj?: AddressFormData | null };
  onInputChange: (field: keyof Address, value: any) => void;
  isLoading?: boolean;
  states: { value: string; label: string }[];
  availableCities: string[];
  handleCEPChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LocationFields({
  form,
  onInputChange,
  isLoading,
  states,
  availableCities,
  handleCEPChange
}: LocationFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zip_code">CEP</Label>
          <Input
            id="zip_code"
            placeholder="CEP"
            value={form.address_obj?.zip_code || ''}
            onChange={handleCEPChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Select
            value={form.address_obj?.state || ''}
            onValueChange={(value) => onInputChange('state', value)}
            disabled={isLoading}
          >
            <SelectTrigger id="state">
              <SelectValue placeholder="Selecione o estado" />
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

        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Select
            value={form.address_obj?.city || ''}
            onValueChange={(value) => onInputChange('city', value)}
            disabled={isLoading || !form.address_obj?.state}
          >
            <SelectTrigger id="city">
              <SelectValue placeholder={form.address_obj?.state ? "Selecione a cidade" : "Selecione um estado primeiro"} />
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
