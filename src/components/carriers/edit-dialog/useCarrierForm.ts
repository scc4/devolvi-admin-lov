
import { useState, useEffect } from "react";
import type { Carrier } from "@/types/carrier";
import { fetchCitiesByState } from "@/services/ibge-api";
import { maskPhoneBR } from "@/lib/format";

export function useCarrierForm(carrier: Carrier, onSave: (carrier: Carrier) => Promise<void>) {
  const [formData, setFormData] = useState<Carrier>({ ...carrier });
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

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
    availableCities,
    isLoadingCities,
    setFormData,
    setAvailableCities,
    setIsLoadingCities,
    handlePhoneChange,
    handleChange,
    handleSubmit
  };
}
