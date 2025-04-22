
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchStates, fetchCitiesByState } from "@/services/ibge-api";
import { Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ServedCity {
  id: string;
  state: string;
  city: string;
}

interface ServedCitiesTabProps {
  carrierId: string;
  isSubmitting?: boolean;
}

export function ServedCitiesTab({ carrierId, isSubmitting }: ServedCitiesTabProps) {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { data: states = [] } = useQuery({
    queryKey: ['states'],
    queryFn: fetchStates,
  });

  const { data: cities = [], isLoading: isLoadingCities } = useQuery({
    queryKey: ['cities', selectedState],
    queryFn: () => selectedState ? fetchCitiesByState(selectedState) : Promise.resolve([]),
    enabled: !!selectedState,
  });

  const { data: servedCities = [], refetch: refetchServedCities } = useQuery({
    queryKey: ['served-cities', carrierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carrier_served_cities')
        .select('*')
        .eq('carrier_id', carrierId);

      if (error) throw error;
      return data as ServedCity[];
    },
  });

  const handleAddCity = async () => {
    if (!selectedState || !selectedCity) return;

    const { error } = await supabase
      .from('carrier_served_cities')
      .insert({
        carrier_id: carrierId,
        state: selectedState,
        city: selectedCity,
      });

    if (error) {
      if (error.code === '23505') { // Unique violation
        toast.error('Esta cidade já está cadastrada para esta transportadora');
      } else {
        toast.error('Erro ao adicionar cidade');
        console.error('Error adding city:', error);
      }
      return;
    }

    toast.success('Cidade adicionada com sucesso');
    refetchServedCities();
    setSelectedCity("");
  };

  const handleRemoveCity = async (cityId: string) => {
    const { error } = await supabase
      .from('carrier_served_cities')
      .delete()
      .eq('id', cityId);

    if (error) {
      toast.error('Erro ao remover cidade');
      console.error('Error removing city:', error);
      return;
    }

    toast.success('Cidade removida com sucesso');
    refetchServedCities();
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <Select
            value={selectedState}
            onValueChange={setSelectedState}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.sigla} value={state.sigla}>
                  {state.nome} ({state.sigla})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select
            value={selectedCity}
            onValueChange={setSelectedCity}
            disabled={isSubmitting || !selectedState || isLoadingCities}
          >
            <SelectTrigger>
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
              {cities.map((city) => (
                <SelectItem key={city.nome} value={city.nome}>
                  {city.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleAddCity} 
          disabled={isSubmitting || !selectedState || !selectedCity}
        >
          Adicionar
        </Button>
      </div>

      <div className="space-y-2">
        {servedCities.map((city) => (
          <div 
            key={city.id} 
            className="flex items-center justify-between p-3 border rounded-lg"
          >
            <span>
              {city.city} - {city.state}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveCity(city.id)}
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        {servedCities.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma cidade cadastrada
          </p>
        )}
      </div>
    </div>
  );
}
