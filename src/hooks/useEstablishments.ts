import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { EstablishmentWithDetails } from "@/types/establishment";

export function useEstablishments() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: establishments = [], isLoading: loading } = useQuery({
    queryKey: ['establishments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('establishments')
        .select(`
          *,
          collection_points(id),
          carrier:carriers(id, name)
        `)
        .order('name');

      if (error) {
        setError(error.message);
        throw error;
      }

      return data.map(est => ({
        ...est,
        collection_points_count: est.collection_points.length
      })) as EstablishmentWithDetails[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newEstablishment: Partial<EstablishmentWithDetails>) => {
      const { data, error } = await supabase
        .from('establishments')
        .insert(newEstablishment)
        .select(`
          *,
          collection_points(id),
          carrier:carriers(id, name)
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['establishments'] });
      toast.success('Estabelecimento cadastrado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar estabelecimento');
      console.error('Error creating establishment:', error);
    }
  });

  const editMutation = useMutation({
    mutationFn: async (updates: EstablishmentWithDetails) => {
      const { data, error } = await supabase
        .from('establishments')
        .upsert(updates)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['establishments'] });
      toast.success('Estabelecimento atualizado com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar estabelecimento');
      console.error('Error updating establishment:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (establishment: EstablishmentWithDetails) => {
      const { error } = await supabase
        .from('establishments')
        .delete()
        .eq('id', establishment.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['establishments'] });
      toast.success('Estabelecimento excluído com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao excluir estabelecimento');
      console.error('Error deleting establishment:', error);
    }
  });

  const handleEdit = async (establishment: EstablishmentWithDetails) => {
    await editMutation.mutateAsync(establishment);
  };

  const handleDelete = async (establishment: EstablishmentWithDetails) => {
    await deleteMutation.mutateAsync(establishment);
  };

  const handleCreate = async (establishment: Partial<EstablishmentWithDetails>) => {
    await createMutation.mutateAsync(establishment);
  };

  const loadEstablishments = () => {
    setError(null);
    queryClient.invalidateQueries({ queryKey: ['establishments'] });
  };

  return {
    establishments,
    loading,
    error,
    loadEstablishments,
    handleEdit,
    handleDelete,
    handleCreate
  };
}
