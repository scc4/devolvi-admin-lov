
import { useState, useEffect } from "react";
import { fetchStates, fetchCitiesByState } from "@/services/ibge-api";
import type { CollectionPoint } from "@/types/collection-point";

export function useAddressForm(
  form: Partial<CollectionPoint>,
  onInputChange: (field: keyof CollectionPoint, value: any) => void
) {
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

  return {
    states,
    availableCities,
    isLoadingCities,
    handleCEPChange
  };
}
