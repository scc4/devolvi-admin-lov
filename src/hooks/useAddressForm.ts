
import { useState, useEffect } from "react";
import { fetchStates, fetchCitiesByState } from "@/services/ibge-api";
import { maskCEP } from "@/lib/format";
import type { CollectionPoint, Address } from "@/types/collection-point";

export function useAddressForm(
  form: Partial<CollectionPoint> & { address_obj?: Address | null },
  onInputChange: (field: keyof Address, value: any) => void
) {
  const [states, setStates] = useState<{ value: string; label: string; }[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isLoadingStates, setIsLoadingStates] = useState(true);

  useEffect(() => {
    const loadStates = async () => {
      try {
        setIsLoadingStates(true);
        const ibgeStates = await fetchStates();
        setStates(ibgeStates.map(state => ({
          value: state.sigla,
          label: `${state.nome} (${state.sigla})`
        })));
      } catch (error) {
        console.error("Error loading states:", error);
      } finally {
        setIsLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (form.address_obj?.state) {
        setIsLoadingCities(true);
        try {
          const cities = await fetchCitiesByState(form.address_obj.state);
          setAvailableCities(cities.map(city => city.nome));
          
          if (form.address_obj?.city && !cities.find(city => city.nome === form.address_obj?.city)) {
            onInputChange('city', '');
          }
        } catch (error) {
          console.error("Error loading cities:", error);
          setAvailableCities([]);
        } finally {
          setIsLoadingCities(false);
        }
      } else {
        setAvailableCities([]);
      }
    };
    loadCities();
  }, [form.address_obj?.state, onInputChange, form.address_obj?.city]);

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskCEP(e.target.value);
    onInputChange('zip_code', maskedValue);
  };

  return {
    states,
    availableCities,
    isLoadingCities,
    isLoadingStates,
    handleCEPChange
  };
}
