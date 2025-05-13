
import { useState, useEffect } from "react";
import { fetchStates, fetchCitiesByState } from "@/services/ibge-api";
import { maskCEP } from "@/lib/format";
import type { CollectionPoint, Address } from "@/types/collection-point";

export function useAddressForm(
  form: Partial<CollectionPoint> & { address?: Partial<Address> },
  onInputChange: (field: keyof Address, value: any) => void
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
      if (form.address?.state) {
        setIsLoadingCities(true);
        const cities = await fetchCitiesByState(form.address.state);
        setAvailableCities(cities.map(city => city.nome));
        setIsLoadingCities(false);
        
        if (form.address?.city && !cities.find(city => city.nome === form.address?.city)) {
          onInputChange('city', '');
        }
      } else {
        setAvailableCities([]);
      }
    };
    loadCities();
  }, [form.address?.state]);

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
