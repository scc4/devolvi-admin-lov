
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
        console.error("Error fetching establishments:", error);
        setError(error.message);
        throw error;
      }

      return data.map(est => ({
        ...est,
        collection_points_count: est.collection_points?.length || 0
      })) as EstablishmentWithDetails[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (newEstablishment: { name: string; type: 'public' | 'private' }) => {
      console.log("Creating establishment:", newEstablishment);
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
    mutationFn: async (updates: Partial<EstablishmentWithDetails>) => {
      console.log("Updating establishment:", updates);
      
      if (!updates.id) {
        throw new Error("ID do estabelecimento é obrigatório para atualização");
      }

      const { data, error } = await supabase
        .from('establishments')
        .update({
          name: updates.name,
          type: updates.type
        })
        .eq('id', updates.id)
        .select(`
          *,
          collection_points(id),
          carrier:carriers(id, name)
        `)
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
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
      console.log("Deleting establishment:", establishment.id);
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

  const handleEdit = async (establishment: Partial<EstablishmentWithDetails>) => {
    await editMutation.mutateAsync(establishment);
  };

  const handleDelete = async (establishment: EstablishmentWithDetails) => {
    await deleteMutation.mutateAsync(establishment);
  };

  const handleCreate = async (establishment: Partial<EstablishmentWithDetails>) => {
    if (!establishment.name || !establishment.type) {
      toast.error('Nome e tipo do estabelecimento são obrigatórios');
      return;
    }
    await createMutation.mutateAsync({ 
      name: establishment.name, 
      type: establishment.type 
    });
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
