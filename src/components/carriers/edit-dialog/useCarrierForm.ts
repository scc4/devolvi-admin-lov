
import { useState, useEffect } from "react";
import type { Carrier } from "@/types/carrier";
import { fetchStates, fetchCitiesByState } from "@/services/ibge-api";
import { maskPhoneBR } from "@/lib/format";

interface CarrierFormState {
  value: string;
  label: string;
}

export function useCarrierForm(carrier: Carrier, onSave: (carrier: Carrier) => Promise<void>) {
  const [formData, setFormData] = useState<Carrier>({ ...carrier });
  const [states, setStates] = useState<CarrierFormState[]>([]);
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
      if (formData.state) {
        setIsLoadingCities(true);
        const cities = await fetchCitiesByState(formData.state);
        setAvailableCities(cities.map(city => city.nome));
        setIsLoadingCities(false);
      } else {
        setAvailableCities([]);
      }
    };
    loadCities();
  }, [formData.state]);

  useEffect(() => {
    setFormData({ ...carrier });
  }, [carrier]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhoneBR(e.target.value);
    setFormData(prev => ({ ...prev, phone: maskedValue }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave(formData);
  };

  return {
    formData,
    states,
    availableCities,
    isLoadingCities,
    setFormData,
    handlePhoneChange,
    handleChange,
    handleSubmit
  };
}
