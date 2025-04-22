
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CollectionPoint } from "@/types/collection-point";

export function useCollectionPoints(
  establishmentId?: string | null, 
  carrierId?: string | null,
  fetchUnassigned?: boolean,
  cityFilter?: string
) {
  const queryClient = useQueryClient();
  
  const { data: collectionPoints = [], isLoading, refetch } = useQuery({
    queryKey: ['collection-points', establishmentId, carrierId, fetchUnassigned, cityFilter],
    queryFn: async () => {
      let query = supabase
        .from('collection_points')
        .select(`
          *,
          establishment:establishments(name)
        `);
      
      if (fetchUnassigned) {
        query = query.is('carrier_id', null);
        
        if (cityFilter) {
          query = query.eq('city', cityFilter);
        }
      } else if (establishmentId) {
        query = query.eq('establishment_id', establishmentId);
      } else if (carrierId) {
        query = query.eq('carrier_id', carrierId);
      }
      
      const { data, error } = await query.order('name');

      if (error) {
        toast.error('Erro ao carregar pontos de coleta');
        throw error;
      }

      return data as (CollectionPoint & { establishment: { name: string } | null })[];
    },
    enabled: true
  });

  const createMutation = useMutation({
    mutationFn: async (newPoint: Partial<CollectionPoint>) => {
      // Validação mínima necessária
      if (!newPoint.name) throw new Error('Nome do ponto de coleta não fornecido');
      if (!newPoint.address) throw new Error('Endereço não fornecido');
      
      // Prepare data for insertion, ensuring carrier_id is null if empty
      const pointData = {
        establishment_id: newPoint.establishment_id || null,
        name: newPoint.name,
        address: newPoint.address,
        carrier_id: newPoint.carrier_id || null, // Set to null if empty
        phone: newPoint.phone || null,
        street: newPoint.street || null,
        number: newPoint.number || null,
        complement: newPoint.complement || null,
        district: newPoint.district || null,
        zip_code: newPoint.zip_code || null,
        city: newPoint.city || null,
        state: newPoint.state || null,
        latitude: newPoint.latitude || null,
        longitude: newPoint.longitude || null,
        is_active: newPoint.is_active ?? true,
        operating_hours: newPoint.operating_hours || null
      };
      
      const { data, error } = await supabase
        .from('collection_points')
        .insert(pointData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-points'] });
      toast.success('Ponto de coleta cadastrado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar ponto de coleta');
      console.error('Error creating collection point:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (point: Partial<CollectionPoint>) => {
      if (!point.id) throw new Error('ID do ponto de coleta não fornecido');
      
      // Ensure carrier_id is null if empty
      const pointData = {
        ...point,
        carrier_id: point.carrier_id || null
      };

      const { data, error } = await supabase
        .from('collection_points')
        .update(pointData)
        .eq('id', point.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-points'] });
      toast.success('Ponto de coleta atualizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar ponto de coleta');
      console.error('Error updating collection point:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (pointId: string) => {
      const { error } = await supabase
        .from('collection_points')
        .delete()
        .eq('id', pointId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-points'] });
      toast.success('Ponto de coleta excluído com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao excluir ponto de coleta');
      console.error('Error deleting collection point:', error);
    }
  });

  return {
    collectionPoints,
    isLoading,
    createCollectionPoint: createMutation.mutateAsync,
    updateCollectionPoint: updateMutation.mutateAsync,
    deleteCollectionPoint: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch
  };
}
