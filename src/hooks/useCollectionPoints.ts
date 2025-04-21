
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CollectionPoint } from "@/types/collection-point";

export function useCollectionPoints(establishmentId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: collectionPoints = [], isLoading } = useQuery({
    queryKey: ['collection-points', establishmentId],
    queryFn: async () => {
      if (!establishmentId) return [];
      
      const { data, error } = await supabase
        .from('collection_points')
        .select('*')
        .eq('establishment_id', establishmentId)
        .order('name');

      if (error) {
        toast.error('Erro ao carregar pontos de coleta');
        throw error;
      }

      return data as CollectionPoint[];
    },
    enabled: !!establishmentId
  });

  const createMutation = useMutation({
    mutationFn: async (newPoint: Partial<CollectionPoint>) => {
      if (!establishmentId) throw new Error('ID do estabelecimento não fornecido');
      
      const { data, error } = await supabase
        .from('collection_points')
        .insert({ ...newPoint, establishment_id: establishmentId })
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
    isDeleting: deleteMutation.isPending
  };
}
