
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import { fetchStates, fetchCitiesByState } from "@/services/ibge-api";

interface LocationSelectorProps {
  form: Partial<CollectionPoint>;
  onInputChange: (field: keyof CollectionPoint, value: any) => void;
  isLoading?: boolean;
}

export function LocationSelector({ form, onInputChange, isLoading }: LocationSelectorProps) {
  const [states, setStates] = useState<{ value: string; label: string; }[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  useEffect(() => {
    const loadStates = async () => {
      setIsLoadingStates(true);
      try {
        const ibgeStates = await fetchStates();
        if (Array.isArray(ibgeStates) && ibgeStates.length > 0) {
          setStates(ibgeStates.map(state => ({
            value: state.sigla,
            label: `${state.nome} (${state.sigla})`
          })));
        } else {
          console.error('No states returned from API');
          setStates([]);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
        setStates([]);
      } finally {
        setIsLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (form.state) {
        setIsLoadingCities(true);
        try {
          const cities = await fetchCitiesByState(form.state);
          if (Array.isArray(cities) && cities.length > 0) {
            const cityNames = cities.map(city => city.nome);
            setAvailableCities(cityNames);
            
            if (form.city && !cityNames.includes(form.city)) {
              onInputChange('city', '');
            }
          } else {
            console.error('No cities returned from API for state:', form.state);
            setAvailableCities([]);
            if (form.city) {
              onInputChange('city', '');
            }
          }
        } catch (error) {
          console.error('Error fetching cities:', error);
          setAvailableCities([]);
          if (form.city) {
            onInputChange('city', '');
          }
        } finally {
          setIsLoadingCities(false);
        }
      } else {
        setAvailableCities([]);
        if (form.city) {
          onInputChange('city', '');
        }
      }
    };
    loadCities();
  }, [form.state]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="state">Estado</Label>
        <Popover open={stateOpen} onOpenChange={setStateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={stateOpen}
              className="w-full justify-between"
              disabled={isLoading || isLoadingStates}
            >
              {isLoadingStates ? (
                "Carregando estados..."
              ) : form.state && states.length > 0 ? (
                states.find((state) => state.value === form.state)?.label || "Selecione o estado..."
              ) : (
                "Selecione o estado..."
              )}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <div className="max-h-[200px] overflow-auto p-1">
              {isLoadingStates ? (
                <div className="p-2 text-sm">Carregando estados...</div>
              ) : states && states.length > 0 ? (
                states.map((state) => (
                  <Button
                    key={state.value}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      onInputChange('state', state.value);
                      setStateOpen(false);
                    }}
                  >
                    {state.label}
                  </Button>
                ))
              ) : (
                <div className="p-2 text-sm">Nenhum estado encontrado.</div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">Cidade</Label>
        <Popover open={cityOpen} onOpenChange={setCityOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={cityOpen}
              className="w-full justify-between"
              disabled={isLoading || !form.state || isLoadingCities}
            >
              {isLoadingCities 
                ? "Carregando cidades..." 
                : form.city || (form.state 
                  ? "Selecione a cidade" 
                  : "Selecione um estado primeiro")}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <div className="max-h-[200px] overflow-auto p-1">
              {isLoadingCities ? (
                <div className="p-2 text-sm">Carregando cidades...</div>
              ) : form.state && availableCities && availableCities.length > 0 ? (
                availableCities.map((city) => (
                  <Button
                    key={city}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      onInputChange('city', city);
                      setCityOpen(false);
                    }}
                  >
                    {city}
                  </Button>
                ))
              ) : (
                <div className="p-2 text-sm">
                  {form.state ? "Nenhuma cidade encontrada" : "Selecione um estado primeiro"}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
