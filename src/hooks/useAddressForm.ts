
import { useState, useEffect } from "react";
import { fetchStates, fetchCitiesByState } from "@/services/ibge-api";
import { maskCEP } from "@/lib/format";
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
    // A pesquisa de cidades só deve acontecer se o campo state foi alterado manualmente/modificado.
    // O fluxo automático do CEP preenche os campos diretamente!
    if (form.state) {
      setIsLoadingCities(true);
      fetchCitiesByState(form.state).then(cities => {
        setAvailableCities(cities.map(city => city.nome));
        setIsLoadingCities(false);

        // Se a cidade não está mais disponível na lista, limpa o campo
        if (form.city && !cities.find(city => city.nome === form.city)) {
          onInputChange('city', '');
        }
      });
    } else {
      setAvailableCities([]);
    }
    // eslint-disable-next-line
  }, [form.state]); // não incluir onInputChange para não criar loops

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
