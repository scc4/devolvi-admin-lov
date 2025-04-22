
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Carrier } from "@/types/carrier";
import { fetchStates, fetchCitiesByState } from "@/services/ibge-api";

interface LocationInfoProps {
  formData: Carrier;
  availableCities: string[];
  isLoadingCities: boolean;
  isSubmitting?: boolean;
  setFormData: (value: React.SetStateAction<Carrier>) => void;
  setAvailableCities: (value: React.SetStateAction<string[]>) => void;
  setIsLoadingCities: (value: React.SetStateAction<boolean>) => void;
}

export function LocationInfo({
  formData,
  availableCities,
  isLoadingCities,
  isSubmitting = false,
  setFormData,
  setAvailableCities,
  setIsLoadingCities
}: LocationInfoProps) {
  const [selectedState, setSelectedState] = useState("");
  const [states, setStates] = useState<Array<{value: string; label: string}>>([]);
  
  // Load states when component mounts
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

  // Determine the state based on the city when the component mounts
  useEffect(() => {
    const determineStateFromCity = async () => {
      // Only run this for existing carriers with a city
      if (formData.id && formData.city) {
        try {
          // Try to find the state for all cities with this name
          const allStates = await fetchStates();
          
          // We need to check each state for the city
          for (const state of allStates) {
            setIsLoadingCities(true);
            const cities = await fetchCitiesByState(state.sigla);
            const cityExists = cities.some(city => city.nome === formData.city);
            
            if (cityExists) {
              setSelectedState(state.sigla);
              setAvailableCities(cities.map(city => city.nome));
              break;
            }
          }
        } catch (error) {
          console.error("Error determining state from city:", error);
        } finally {
          setIsLoadingCities(false);
        }
      }
    };
    
    if (!selectedState && formData.city) {
      determineStateFromCity();
    }
  }, [formData.id, formData.city, selectedState, setIsLoadingCities, setAvailableCities]);
  
  // Load cities when state changes
  useEffect(() => {
    const loadCities = async () => {
      if (selectedState) {
        setFormData(prev => ({ ...prev, city: '' }));
        setIsLoadingCities(true);
        try {
          const cities = await fetchCitiesByState(selectedState);
          setAvailableCities(cities.map(city => city.nome));
        } finally {
          setIsLoadingCities(false);
        }
      }
    };
    
    // Only load cities if we don't already have the city in the form data
    // or if the state has changed
    if (selectedState && (!formData.city || !availableCities.includes(formData.city))) {
      loadCities();
    }
  }, [selectedState, setFormData, setIsLoadingCities, setAvailableCities, formData.city, availableCities]);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="state">Estado</Label>
        <Select
          value={selectedState}
          onValueChange={setSelectedState}
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
          disabled={isSubmitting || !selectedState || isLoadingCities}
        >
          <SelectTrigger id="city">
            <SelectValue 
              placeholder={
                isLoadingCities 
                  ? "Carregando cidades..." 
                  : selectedState 
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
