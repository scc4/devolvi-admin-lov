
import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { CollectionPoint } from '@/types/collection-point';
import type { Json } from '@/integrations/supabase/types';

interface UseCollectionPointsQueryProps {
  establishmentId?: string;
  carrierId?: string;
  unassigned?: boolean;
  cityFilter?: string; // This is now properly included in the interface
}

export function useCollectionPointsQuery(props: UseCollectionPointsQueryProps = {}) {
  const { establishmentId, carrierId, unassigned, cityFilter } = props;
  const queryClient = useQueryClient();
  
  // Generate a stable query key based on parameters
  const queryKey = useMemo(() => {
    const key = ['collectionPoints'];
    if (establishmentId) key.push(`establishment-${establishmentId}`);
    if (carrierId) key.push(`carrier-${carrierId}`);
    if (unassigned) key.push('unassigned');
    if (cityFilter) key.push(`city-${cityFilter}`);
    return key;
  }, [establishmentId, carrierId, unassigned, cityFilter]);
  
  // Fetch collection points
  const { 
    data: collectionPoints = [], 
    isLoading: loading, 
    error: queryError,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from('collection_points')
        .select(`
          *,
          establishment:establishments(id, name),
          carrier:carriers!collection_points_carrier_id_fkey(id, name)
        `)
        .is('deleted_at', null);
      
      // Apply filters
      if (establishmentId) {
        query = query.eq('establishment_id', establishmentId);
      }
      
      if (carrierId) {
        query = query.eq('carrier_id', carrierId);
      }
      
      if (unassigned) {
        query = query.is('carrier_id', null);
      }

      // Apply city filter if provided
      if (cityFilter) {
        const cities = cityFilter.split(',');
        if (cities.length > 0) {
          query = query.in('city', cities);
        }
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      
      // Map to UI model and explicitly cast operating_hours to the expected type
      return data.map(cp => {
        const operatingHours = cp.operating_hours as unknown as { 
          [day: string]: { open: string; close: string }[] 
        } | null;

        // Use safe access pattern with type guards to handle potential null carriers
        const carrier = cp.carrier ? {
          id: typeof cp.carrier === 'object' ? cp.carrier.id : null,
          name: typeof cp.carrier === 'object' ? cp.carrier.name : null
        } : null;

        return {
          id: cp.id,
          name: cp.name,
          address: cp.address,
          establishment_id: cp.establishment_id,
          establishment: cp.establishment ? {
            id: cp.establishment.id,
            name: cp.establishment.name
          } : null,
          carrier_id: cp.carrier_id,
          carrier,
          phone: cp.phone,
          street: cp.street,
          number: cp.number,
          complement: cp.complement,
          district: cp.district,
          zip_code: cp.zip_code,
          city: cp.city,
          state: cp.state,
          latitude: cp.latitude,
          longitude: cp.longitude,
          is_active: cp.is_active,
          operating_hours: operatingHours,
          created_at: cp.created_at,
          updated_at: cp.updated_at
        };
      }) as CollectionPoint[];
    },
    enabled: !!(establishmentId || carrierId || unassigned)
  });
  
  // Error handling
  const error = queryError ? 
    (queryError instanceof Error ? queryError.message : 'Error loading collection points') 
    : null;
  
  // Create collection point mutation
  const createMutation = useMutation({
    mutationFn: async (newPoint: Partial<CollectionPoint>) => {
      const { data, error } = await supabase
        .from('collection_points')
        .insert({
          name: newPoint.name,
          address: newPoint.address || '',
          establishment_id: newPoint.establishment_id,
          carrier_id: newPoint.carrier_id,
          phone: newPoint.phone,
          street: newPoint.street,
          number: newPoint.number,
          complement: newPoint.complement,
          district: newPoint.district,
          zip_code: newPoint.zip_code,
          city: newPoint.city,
          state: newPoint.state,
          latitude: newPoint.latitude,
          longitude: newPoint.longitude,
          is_active: newPoint.is_active ?? true,
          operating_hours: newPoint.operating_hours as Json
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectionPoints'] });
      toast.success("Ponto de coleta cadastrado com sucesso");
    },
    onError: (error) => {
      console.error("Error creating collection point:", error);
      toast.error("Erro ao cadastrar ponto de coleta");
    }
  });
  
  // Update collection point mutation
  const updateMutation = useMutation({
    mutationFn: async (point: Partial<CollectionPoint>) => {
      if (!point.id) throw new Error('Collection point ID is required for update');
      
      const { data, error } = await supabase
        .from('collection_points')
        .update({
          name: point.name,
          address: point.address,
          establishment_id: point.establishment_id,
          carrier_id: point.carrier_id,
          phone: point.phone,
          street: point.street,
          number: point.number,
          complement: point.complement,
          district: point.district,
          zip_code: point.zip_code,
          city: point.city,
          state: point.state,
          latitude: point.latitude,
          longitude: point.longitude,
          is_active: point.is_active,
          operating_hours: point.operating_hours as Json,
          updated_at: new Date().toISOString()
        })
        .eq('id', point.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectionPoints'] });
      toast.success("Ponto de coleta atualizado com sucesso");
    },
    onError: (error) => {
      console.error("Error updating collection point:", error);
      toast.error("Erro ao atualizar ponto de coleta");
    }
  });
  
  // Delete collection point mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('collection_points')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectionPoints'] });
      toast.success("Ponto de coleta excluído com sucesso");
    },
    onError: (error) => {
      console.error("Error deleting collection point:", error);
      toast.error("Erro ao excluir ponto de coleta");
    }
  });
  
  // Assign carrier mutation
  const assignCarrierMutation = useMutation({
    mutationFn: async ({ collectionPointId, carrierId }: { collectionPointId: string, carrierId: string | null }) => {
      const { data, error } = await supabase
        .from('collection_points')
        .update({ carrier_id: carrierId })
        .eq('id', collectionPointId)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collectionPoints'] });
      toast.success("Transportadora associada com sucesso");
    },
    onError: (error) => {
      console.error("Error assigning carrier:", error);
      toast.error("Erro ao associar transportadora");
    }
  });

  return {
    collectionPoints,
    loading,
    error,
    refetch,
    createCollectionPoint: createMutation.mutateAsync,
    updateCollectionPoint: updateMutation.mutateAsync,
    deleteCollectionPoint: deleteMutation.mutateAsync,
    assignCarrier: assignCarrierMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isAssigningCarrier: assignCarrierMutation.isPending
  };
}
