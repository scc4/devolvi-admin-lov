
import { useState, useEffect } from "react";
import { fetchStates, fetchCitiesByState } from "@/services/ibge-api";
import { maskCEP } from "@/lib/format";
import type { CollectionPoint, Address, AddressFormData } from "@/types/collection-point";

export function useAddressForm(
  form: Partial<CollectionPoint> & { address_obj?: AddressFormData | null },
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
      if (form.address_obj?.state) {
        setIsLoadingCities(true);
        const cities = await fetchCitiesByState(form.address_obj.state);
        setAvailableCities(cities.map(city => city.nome));
        setIsLoadingCities(false);
        
        if (form.address_obj?.city && !cities.find(city => city.nome === form.address_obj?.city)) {
          onInputChange('city', '');
        }
      } else {
        setAvailableCities([]);
      }
    };
    loadCities();
  }, [form.address_obj?.state]);

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
