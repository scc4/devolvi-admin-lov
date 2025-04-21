
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Carrier } from "@/types/carrier";

export function useCarriers() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: carriers = [], isLoading: loading } = useQuery({
    queryKey: ['carriers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carriers')
        .select('*')
        .order('name');

      if (error) {
        setError(error.message);
        throw error;
      }

      return data as Carrier[];
    }
  });

  const editMutation = useMutation({
    mutationFn: async (updates: Carrier) => {
      const { data, error } = await supabase
        .from('carriers')
        .upsert(updates)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      toast.success('Transportadora atualizada com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar transportadora');
      console.error('Error updating carrier:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (carrier: Carrier) => {
      const { error } = await supabase
        .from('carriers')
        .delete()
        .eq('id', carrier.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      toast.success('Transportadora excluída com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao excluir transportadora');
      console.error('Error deleting carrier:', error);
    }
  });

  const deactivateMutation = useMutation({
    mutationFn: async (carrier: Carrier) => {
      const { error } = await supabase
        .from('carriers')
        .update({ is_active: false })
        .eq('id', carrier.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      toast.success('Transportadora desativada com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao desativar transportadora');
      console.error('Error deactivating carrier:', error);
    }
  });

  const handleEdit = async (carrier: Carrier) => {
    await editMutation.mutateAsync(carrier);
  };

  const handleDelete = async (carrier: Carrier) => {
    await deleteMutation.mutateAsync(carrier);
  };

  const handleDeactivate = async (carrier: Carrier) => {
    await deactivateMutation.mutateAsync(carrier);
  };

  const loadCarriers = () => {
    setError(null);
    queryClient.invalidateQueries({ queryKey: ['carriers'] });
  };

  return {
    carriers,
    loading,
    error,
    loadCarriers,
    handleEdit,
    handleDelete,
    handleDeactivate
  };
}
