
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CollectionPoint } from "@/types/collection-point";

export function useCollectionPoints(establishmentId: string | undefined) {
  const queryClient = useQueryClient();
  
  // Determine if we're querying by establishment or carrier
  const isCarrierContext = !establishmentId;

  const { data: collectionPoints = [], isLoading, refetch } = useQuery({
    queryKey: ['collection-points', establishmentId],
    queryFn: async () => {
      let query = supabase.from('collection_points').select('*');
      
      if (establishmentId) {
        // Filter by establishment
        query = query.eq('establishment_id', establishmentId);
      } else {
        // If no establishmentId is provided, assume we want carrier collection points
        // with establishment_id = null
        query = query.is('establishment_id', null);
      }
      
      const { data, error } = await query.order('name');

      if (error) {
        toast.error('Erro ao carregar pontos de coleta');
        throw error;
      }

      return data as CollectionPoint[];
    },
    enabled: true // Always enabled as we might want carrier collection points
  });

  const createMutation = useMutation({
    mutationFn: async (newPoint: Partial<CollectionPoint>) => {
      if (!newPoint.carrier_id) throw new Error('ID da transportadora não fornecido');
      if (!newPoint.name) throw new Error('Nome do ponto de coleta não fornecido');
      if (!newPoint.address) throw new Error('Endereço não fornecido');
      
      const { data, error } = await supabase
        .from('collection_points')
        .insert({
          establishment_id: newPoint.establishment_id || null,
          name: newPoint.name,
          address: newPoint.address,
          carrier_id: newPoint.carrier_id,
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
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-points', establishmentId] });
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
      
      const { data, error } = await supabase
        .from('collection_points')
        .update(point)
        .eq('id', point.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-points', establishmentId] });
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
      queryClient.invalidateQueries({ queryKey: ['collection-points', establishmentId] });
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
