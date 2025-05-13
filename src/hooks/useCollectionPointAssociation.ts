
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCollectionPointCasesWithDI } from "@/presentation/hooks/useCollectionPointCasesWithDI";
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
    collectionPoints: unassignedPointsData,
    loading: isLoadingUnassigned,
    loadCollectionPoints: refetchUnassigned
  } = useCollectionPointCasesWithDI({
    unassigned: true,
    cityFilter: filterByServedCities ? servedCities.join(',') : undefined
  });

  const {
    collectionPoints: carrierPointsData,
    loading: isLoadingCarrier,
    loadCollectionPoints: refetchCarrier,
    handleAssignCarrier
  } = useCollectionPointCasesWithDI({
    carrierId
  });

  // Convert DDD entities to UI models
  const unassignedPoints = unassignedPointsData.map(
    point => collectionPointAdapter.toUIModel ? 
      collectionPointAdapter.toUIModel(point) : 
      point as unknown as CollectionPoint
  );

  const carrierPoints = carrierPointsData.map(
    point => collectionPointAdapter.toUIModel ? 
      collectionPointAdapter.toUIModel(point) : 
      point as unknown as CollectionPoint
  );

  // Filter points based on served cities
  const filteredUnassignedPoints = filterByServedCities
    ? unassignedPoints.filter(point => servedCities.includes(point.city || ''))
    : unassignedPoints;

  const handleAssociatePoint = async (point: CollectionPoint) => {
    try {
      await handleAssignCarrier(point.id, carrierId);
      toast.success('Ponto de coleta associado com sucesso');
      refetchUnassigned();
      refetchCarrier();
    } catch (error) {
      console.error('Error associating collection point:', error);
      toast.error('Erro ao associar ponto de coleta');
    }
  };

  const handleDisassociatePoint = async (point: CollectionPoint) => {
    try {
      await handleAssignCarrier(point.id, null);
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
    handleAssociate: handleAssociatePoint,
    handleDisassociate: handleDisassociatePoint,
    refetchUnassigned,
    refetchCarrier
  };
}
