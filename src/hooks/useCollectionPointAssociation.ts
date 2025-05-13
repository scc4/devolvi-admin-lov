
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCollectionPointsQuery } from "@/hooks/useCollectionPointsQuery";
import type { CollectionPoint } from "@/types/collection-point";
import { collectionPointAdapter } from "@/adapters/collectionPoints/collectionPointAdapter";

export function useCollectionPointAssociation(carrierId: string) {
  const [carrierName, setCarrierName] = useState<string>("");
  const [carrierCity, setCarrierCity] = useState<string>("");
  const [filterByServedCities, setFilterByServedCities] = useState(true);
  const [servedCities, setServedCities] = useState<string[]>([]);

  // Fetch carrier's served cities
  const { data: servedCitiesData = [], isLoading: isLoadingServedCities } = useQuery({
    queryKey: ['served-cities', carrierId],
    queryFn: async () => {
      if (!carrierId) return [];
      
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
    enabled: !!carrierId,
  });

  // Fetch carrier details
  useEffect(() => {
    const fetchCarrierDetails = async () => {
      if (!carrierId) return;
      
      const { data, error } = await supabase
        .from('carriers')
        .select('name, city')
        .eq('id', carrierId)
        .single();
      
      if (data) {
        setCarrierName(data.name);
        setCarrierCity(data.city);
      } else {
        console.error('Error fetching carrier details:', error);
      }
    };
    
    fetchCarrierDetails();
  }, [carrierId]);

  // Update served cities when data changes
  useEffect(() => {
    if (servedCitiesData) {
      console.log(`Loaded ${servedCitiesData.length} served cities for carrier ${carrierId}`);
      setServedCities(servedCitiesData);
    }
  }, [servedCitiesData, carrierId]);

  // Fetch unassigned points
  const {
    collectionPoints: unassignedPoints,
    loading: isLoadingUnassigned,
    refetch: refetchUnassigned,
    assignCarrier
  } = useCollectionPointsQuery({
    unassigned: true,
    cityFilter: filterByServedCities && servedCities.length > 0 ? servedCities.join(',') : undefined
  });

  // Fetch carrier points
  const {
    collectionPoints: carrierPoints,
    loading: isLoadingCarrier,
    refetch: refetchCarrier
  } = useCollectionPointsQuery({
    carrierId
  });

  // Filter points based on served cities when needed
  const filteredUnassignedPoints = unassignedPoints;

  const handleAssociatePoint = async (point: CollectionPoint) => {
    try {
      console.log(`Associating point ${point.id} with carrier ${carrierId}`);
      // Convert UI model to DTO before passing to the handler
      const pointDTO = collectionPointAdapter.fromUIModel(point);
      await assignCarrier({ collectionPointId: pointDTO.id, carrierId });
      toast.success('Ponto de coleta associado com sucesso');
      await refetchUnassigned();
      await refetchCarrier();
    } catch (error) {
      console.error('Error associating collection point:', error);
      toast.error('Erro ao associar ponto de coleta');
    }
  };

  const handleDisassociatePoint = async (point: CollectionPoint) => {
    try {
      console.log(`Disassociating point ${point.id} from carrier ${carrierId}`);
      // Convert UI model to DTO before passing to the handler
      const pointDTO = collectionPointAdapter.fromUIModel(point);
      await assignCarrier({ collectionPointId: pointDTO.id, carrierId: null });
      toast.success('Ponto de coleta desassociado com sucesso');
      await refetchUnassigned();
      await refetchCarrier();
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
    handleAssociate: handleAssociatePoint,
    handleDisassociate: handleDisassociatePoint,
    refetchUnassigned,
    refetchCarrier
  };
}
