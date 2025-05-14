
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CollectionPoint, Address } from "@/types/collection-point";

export function useCollectionPointsV2(
  establishmentId?: string | null, 
  carrierId?: string | null,
  fetchUnassigned?: boolean,
  cityFilter?: string
) {
  const queryClient = useQueryClient();
  
  const { data: collectionPoints = [], isLoading, refetch } = useQuery({
    queryKey: ['collection-points-v2', establishmentId, carrierId, fetchUnassigned, cityFilter],
    queryFn: async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams();
        
        if (establishmentId) params.append('establishmentId', establishmentId);
        if (carrierId) params.append('carrierId', carrierId);
        if (fetchUnassigned) params.append('fetchUnassigned', 'true');
        if (cityFilter) params.append('cityFilter', cityFilter);
        
        console.log('Fetching collection points with params:', Object.fromEntries(params));
        
        // Call our edge function
        const { data, error } = await supabase.functions.invoke('manage-collection-points', {
          method: 'POST',
          body: {
            operation: 'get'
          }
        });
        
        if (error) {
          console.error('Edge function error:', error);
          toast.error('Erro ao carregar pontos de coleta');
          throw error;
        }
        
        console.log('Collection points data:', data);
        
        return data as CollectionPoint[];
      } catch (error) {
        console.error('Collection points fetch error:', error);
        toast.error('Erro ao carregar pontos de coleta');
        throw error;
      }
    },
    enabled: true
  });

  const createMutation = useMutation({
    mutationFn: async (newPoint: Partial<CollectionPoint>) => {
      try {
        const { data, error } = await supabase.functions.invoke('manage-collection-points', {
          method: 'POST',
          body: {
            operation: 'create',
            data: newPoint
          }
        });
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error('Error creating collection point:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-points-v2'] });
      toast.success('Ponto de coleta cadastrado com sucesso');
    },
    onError: (error: any) => {
      if (error.message?.includes('duplicate key') && error.message?.includes('collection_points_phone_unique')) {
        toast.error('Número de telefone já cadastrado em outro ponto de coleta');
      } else {
        toast.error('Erro ao cadastrar ponto de coleta');
      }
      console.error('Error creating collection point:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (point: Partial<CollectionPoint>) => {
      try {
        if (!point.id) throw new Error('ID do ponto de coleta não fornecido');
        
        const { data, error } = await supabase.functions.invoke('manage-collection-points', {
          method: 'POST',
          body: {
            operation: 'update',
            data: point
          }
        });
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error('Error updating collection point:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-points-v2'] });
      toast.success('Ponto de coleta atualizado com sucesso');
    },
    onError: (error: any) => {
      if (error.message?.includes('duplicate key') && error.message?.includes('collection_points_phone_unique')) {
        toast.error('Número de telefone já cadastrado em outro ponto de coleta');
      } else {
        toast.error('Erro ao atualizar ponto de coleta');
        console.error('Error updating collection point:', error);
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (pointId: string) => {
      try {
        const { data, error } = await supabase.functions.invoke('manage-collection-points', {
          method: 'POST',
          body: {
            operation: 'delete',
            data: { id: pointId }
          }
        });
        
        if (error) {
          throw error;
        }
        
        return data;
      } catch (error) {
        console.error('Error deleting collection point:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-points-v2'] });
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
