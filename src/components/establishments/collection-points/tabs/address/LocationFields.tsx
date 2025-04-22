
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CollectionPoint } from "@/types/collection-point";
import { useCepLookup } from "@/hooks/useCepLookup";
import { useRef, useState } from "react";
import { Alert } from "@/components/ui/alert";

interface LocationFieldsProps {
  form: Partial<CollectionPoint>;
  onInputChange: (field: keyof CollectionPoint, value: any) => void;
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
  handleCEPChange,
}: LocationFieldsProps) {
  const cepInputRef = useRef<HTMLInputElement>(null);
  const [cepFetched, setCepFetched] = useState(false);

  const {
    fetchCep,
    isFetching,
    error,
    setError,
  } = useCepLookup();

  // Quando o campo CEP perde o foco
  const handleCepBlur = async () => {
    setError(null);
    setCepFetched(false);

    // Evita busca durante loading global do formulário
    if (isLoading) return;

    const cep = form.zip_code || "";
    if (!cep || cep.replace(/\D/g, "").length !== 8) {
      return;
    }
    
    const result = await fetchCep(cep);
    if (result) {
      onInputChange("street", result.rua);
      onInputChange("district", result.bairro);
      onInputChange("city", result.cidade);
      onInputChange("state", result.estado);
      setCepFetched(true);
    } else {
      setCepFetched(false);
      // Limpa os campos automáticos para evitar dados perdidos 
      // (Opcional: pode ser removido se não desejar limpar ao erro)
      onInputChange("street", "");
      onInputChange("district", "");
      // Cidades e estados continuam liberados para seleção manual em caso de erro no CEP
    }
  };

  return (
    <>
      {error && <Alert variant="destructive" className="mb-2">{error}</Alert>}
      <div className="grid grid-cols-2 gap-4">
        {/* CEP - agora o primeiro campo */}
        <div className="space-y-2 col-span-2">
          <Label htmlFor="zip_code">CEP</Label>
          <Input
            id="zip_code"
            ref={cepInputRef}
            placeholder="00000-000"
            value={form.zip_code || ''}
            onChange={handleCEPChange}
            maxLength={9}
            onBlur={handleCepBlur}
            disabled={isLoading || isFetching}
            autoComplete="postal-code"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="space-y-2">
          <Label htmlFor="street">Rua</Label>
          <Input
            id="rua"
            placeholder="Rua"
            value={form.street || ''}
            onChange={e => onInputChange('street', e.target.value)}
            disabled={isLoading || isFetching}
            autoComplete="address-line1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">Bairro</Label>
          <Input
            id="bairro"
            placeholder="Bairro"
            value={form.district || ''}
            onChange={e => onInputChange('district', e.target.value)}
            disabled={isLoading || isFetching}
            autoComplete="address-level2"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="estado"
            placeholder="Estado"
            value={form.state || ''}
            onChange={e => {
              onInputChange('state', e.target.value);
              setCepFetched(false);
            }}
            disabled={isLoading || isFetching || cepFetched}
            autoComplete="address-level1"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="cidade"
            placeholder="Cidade"
            value={form.city || ''}
            onChange={e => {
              onInputChange('city', e.target.value);
              setCepFetched(false);
            }}
            disabled={isLoading || isFetching || cepFetched}
            autoComplete="address-level2"
          />
        </div>
      </div>
      {/* Em caso de erro no CEP, permite selecionar estado/cidade via IBGE */}
      {!cepFetched && (
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="select_state">Selecione o Estado</Label>
            <Select
              value={form.state || ''}
              onValueChange={(value) => onInputChange('state', value)}
              disabled={isLoading || isFetching || !states.length}
            >
              <SelectTrigger id="select_state">
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
            <Label htmlFor="select_city">Selecione a Cidade</Label>
            <Select
              value={form.city || ''}
              onValueChange={(value) => onInputChange('city', value)}
              disabled={isLoading || isFetching || !form.state || isLoadingCities}
            >
              <SelectTrigger id="select_city">
                <SelectValue 
                  placeholder={
                    isLoadingCities 
                      ? "Carregando cidades..." 
                      : form.state 
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
      )}
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="address">Endereço Completo *</Label>
          <Input
            id="address"
            placeholder="Endereço completo"
            value={form.address || ''}
            onChange={(e) => onInputChange('address', e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
    </>
  );
}
