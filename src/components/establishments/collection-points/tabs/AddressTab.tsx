import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { maskCEP } from "@/lib/format";
import type { CollectionPoint } from "@/types/collection-point";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { fetchStates, fetchCitiesByState } from "@/services/ibge-api";
import { LocationMapPicker } from './LocationMapPicker';

interface AddressTabProps {
  form: Partial<CollectionPoint>;
  onInputChange: (field: keyof CollectionPoint, value: any) => void;
  isLoading?: boolean;
}

export function AddressTab({ form, onInputChange, isLoading }: AddressTabProps) {
  const [states, setStates] = useState<{ value: string; label: string; }[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  useEffect(() => {
    const loadStates = async () => {
      const ibgeStates = await fetchStates();
      setStates(ibgeStates.map(state => ({
        value: state.sigla,
        label: `${state.nome} (${state.sigla})`
      })));
    };
    loadStates();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (form.state) {
        setIsLoadingCities(true);
        const cities = await fetchCitiesByState(form.state);
        setAvailableCities(cities.map(city => city.nome));
        setIsLoadingCities(false);
        
        // If current city is not in the new state's cities list, clear it
        if (form.city && !cities.find(city => city.nome === form.city)) {
          onInputChange('city', '');
        }
      } else {
        setAvailableCities([]);
      }
    };
    loadCities();
  }, [form.state]);

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCEP(e.target.value);
    onInputChange('zip_code', maskedValue);
  };

  const handleLocationChange = (lat: number, lng: number) => {
    onInputChange('latitude', lat);
    onInputChange('longitude', lng);
  };

  return (
    <div className="space-y-4">
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zip_code">CEP</Label>
          <Input
            id="zip_code"
            placeholder="00000-000"
            value={form.zip_code || ''}
            onChange={handleCEPChange}
            disabled={isLoading}
            maxLength={9}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Select
            value={form.state || ''}
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
            value={form.city || ''}
            onValueChange={(value) => onInputChange('city', value)}
            disabled={isLoading || !form.state || isLoadingCities}
          >
            <SelectTrigger id="city">
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

        <div className="space-y-2">
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

      <div className="space-y-2">
        <Label>Localização no Mapa</Label>
        <LocationMapPicker
          form={form}
          onLocationChange={handleLocationChange}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            placeholder="Latitude"
            value={form.latitude?.toString() || ''}
            onChange={(e) => onInputChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            placeholder="Longitude"
            value={form.longitude?.toString() || ''}
            onChange={(e) => onInputChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
