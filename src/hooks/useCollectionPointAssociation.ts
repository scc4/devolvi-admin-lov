
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCollectionPoints } from "./useCollectionPoints";
import type { CollectionPoint } from "@/types/collection-point";

export function useCollectionPointAssociation(carrierId: string) {
  const [carrierName, setCarrierName] = useState<string>("");
  const [carrierCity, setCarrierCity] = useState<string>("");
  const [filterByServedCities, setFilterByServedCities] = useState(true);
  const [servedCities, setServedCities] = useState<string[]>([]);

  // Fetch carrier's served cities
  const { data: servedCitiesData = [], isLoading: isLoadingServedCities } = useQuery({
    queryKey: ['served-cities', carrierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carrier_served_cities')
        .select('city')
        .eq('carrier_id', carrierId);

      if (error) {
        toast.error('Erro ao carregar cidades atendidas');
        throw error;
      }
      
      return data.map(row => row.city);
    },
  });

  // Fetch carrier details
  useEffect(() => {
    const fetchCarrierDetails = async () => {
      const { data, error } = await supabase
        .from('carriers')
        .select('name, city')
        .eq('id', carrierId)
        .single();
      
      if (data) {
        setCarrierName(data.name);
        setCarrierCity(data.city);
      }
    };
    
    fetchCarrierDetails();
  }, [carrierId]);

  // Update served cities when data changes
  useEffect(() => {
    setServedCities(servedCitiesData);
  }, [servedCitiesData]);

  // Fetch points
  const {
    collectionPoints: unassignedPoints,
    isLoading: isLoadingUnassigned,
    refetch: refetchUnassigned
  } = useCollectionPoints(null, null, true);

  const {
    collectionPoints: carrierPoints,
    isLoading: isLoadingCarrier,
    refetch: refetchCarrier
  } = useCollectionPoints(undefined, carrierId);

  // Filter points based on served cities
  const filteredUnassignedPoints = filterByServedCities
    ? unassignedPoints.filter(point => {
        if (!point.address_obj || !point.address_obj.city) return false;
        return servedCities.includes(point.address_obj.city);
      })
    : unassignedPoints;

  const handleAssociate = async (point: CollectionPoint) => {
    try {
      const { error } = await supabase
        .from('collection_points')
        .update({ carrier_id: carrierId })
        .eq('id', point.id);

      if (error) throw error;
      
      toast.success('Ponto de coleta associado com sucesso');
      refetchUnassigned();
      refetchCarrier();
    } catch (error) {
      console.error('Error associating collection point:', error);
      toast.error('Erro ao associar ponto de coleta');
    }
  };

  const handleDisassociate = async (point: CollectionPoint) => {
    try {
      const { error } = await supabase
        .from('collection_points')
        .update({ carrier_id: null })
        .eq('id', point.id);

      if (error) throw error;
      
      toast.success('Ponto de coleta desassociado com sucesso');
      refetchUnassigned();
      refetchCarrier();
    } catch (error) {
      console.error('Error disassociating collection point:', error);
      toast.error('Erro ao desassociar ponto de coleta');
    }
  };

  return {
    carrierName,
    carrierCity,
    filterByServedCities,
    setFilterByServedCities,
    filteredUnassignedPoints,
    carrierPoints,
    isLoadingServedCities,
    isLoadingUnassigned,
    isLoadingCarrier,
    handleAssociate,
    handleDisassociate,
    refetchUnassigned,
    refetchCarrier
  };
}
