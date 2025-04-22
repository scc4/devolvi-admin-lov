
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Carrier } from "@/types/carrier";

interface LocationInfoProps {
  formData: Carrier;
  states: Array<{ value: string; label: string }>;
  availableCities: string[];
  isLoadingCities: boolean;
  isSubmitting?: boolean;
  setFormData: (value: React.SetStateAction<Carrier>) => void;
}

export function LocationInfo({
  formData,
  states,
  availableCities,
  isLoadingCities,
  isSubmitting = false,
  setFormData,
}: LocationInfoProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="state">Estado</Label>
        <Select
          value={formData.state || ''}
          onValueChange={(value) => setFormData(prev => ({ ...prev, state: value, city: '' }))}
          disabled={isSubmitting}
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

      <div className="space-y-2">
        <Label htmlFor="city">Cidade</Label>
        <Select
          value={formData.city || ''}
          onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
          disabled={isSubmitting || !formData.state || isLoadingCities}
        >
          <SelectTrigger id="city">
            <SelectValue 
              placeholder={
                isLoadingCities 
                  ? "Carregando cidades..." 
                  : formData.state 
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
    </>
  );
}
