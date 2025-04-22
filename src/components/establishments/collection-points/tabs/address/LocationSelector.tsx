
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
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
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const ibgeStates = await fetchStates();
        setStates(ibgeStates?.map(state => ({
          value: state.sigla,
          label: `${state.nome} (${state.sigla})`
        })) || []);
      } catch (error) {
        console.error('Error fetching states:', error);
        setStates([]);
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
          setAvailableCities(cities?.map(city => city.nome) || []);
          
          if (form.city && !cities?.find(city => city.nome === form.city)) {
            onInputChange('city', '');
          }
        } catch (error) {
          console.error('Error fetching cities:', error);
          setAvailableCities([]);
        } finally {
          setIsLoadingCities(false);
        }
      } else {
        setAvailableCities([]);
      }
    };
    loadCities();
  }, [form.state]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="state">Estado</Label>
        <Popover open={stateOpen} onOpenChange={setStateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={stateOpen}
              className="w-full justify-between"
              disabled={isLoading}
            >
              {form.state && states.length > 0
                ? states.find((state) => state.value === form.state)?.label || "Selecione o estado..."
                : "Selecione o estado..."}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Pesquisar estado..." />
              <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-auto">
                {states && states.length > 0 ? 
                  states.map((state) => (
                    <CommandItem
                      key={state.value}
                      value={state.label}
                      onSelect={() => {
                        onInputChange('state', state.value);
                        setStateOpen(false);
                      }}
                    >
                      {state.label}
                    </CommandItem>
                  )) : 
                  <CommandItem value="loading" disabled>
                    Carregando estados...
                  </CommandItem>
                }
              </CommandGroup>
            </Command>
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
            <Command>
              <CommandInput placeholder="Pesquisar cidade..." />
              <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-auto">
                {isLoadingCities ? (
                  <CommandItem value="loading" disabled>
                    Carregando cidades...
                  </CommandItem>
                ) : availableCities && availableCities.length > 0 ? (
                  availableCities.map((city) => (
                    <CommandItem
                      key={city}
                      value={city}
                      onSelect={() => {
                        onInputChange('city', city);
                        setCityOpen(false);
                      }}
                    >
                      {city}
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem value="no-cities" disabled>
                    {form.state ? "Nenhuma cidade encontrada" : "Selecione um estado primeiro"}
                  </CommandItem>
                )}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
