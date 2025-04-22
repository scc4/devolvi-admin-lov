
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
      // First get the carriers
      const { data: carriersData, error: carriersError } = await supabase
        .from('carriers')
        .select('*')
        .order('name');

      if (carriersError) {
        setError(carriersError.message);
        throw carriersError;
      }

      // Then get collection points count for each carrier
      const carriersWithCount = await Promise.all(
        carriersData.map(async (carrier) => {
          const { count } = await supabase
            .from('collection_points')
            .select('*', { count: 'exact', head: true })
            .eq('carrier_id', carrier.id);

          return {
            ...carrier,
            collection_points_count: count || 0
          };
        })
      );

      return carriersWithCount as (Carrier & { collection_points_count: number })[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (carrier: Partial<Carrier>) => {
      // Make sure required fields are present
      if (!carrier.name) throw new Error('Nome da transportadora é obrigatório');
      if (!carrier.state) throw new Error('Estado é obrigatório');
      if (!carrier.city) throw new Error('Cidade é obrigatória');
      if (!carrier.manager) throw new Error('Gestor responsável é obrigatório');

      const { data, error } = await supabase
        .from('carriers')
        .insert({
          name: carrier.name,
          state: carrier.state,
          city: carrier.city,
          manager: carrier.manager,
          phone: carrier.phone || null,
          email: carrier.email || null,
          is_active: carrier.is_active ?? true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carriers'] });
      toast.success('Transportadora cadastrada com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao cadastrar transportadora');
      console.error('Error creating carrier:', error);
    }
  });

  const editMutation = useMutation({
    mutationFn: async (updates: Carrier) => {
      // Remove the collection_points_count field which is not in the database
      const { collection_points_count, ...carrierData } = updates as Carrier & { collection_points_count?: number };
      
      const { data, error } = await supabase
        .from('carriers')
        .upsert(carrierData)
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

  const handleCreate = async (carrier: Partial<Carrier>) => {
    return await createMutation.mutateAsync(carrier);
  };

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
    handleCreate,
    handleEdit,
    handleDelete,
    handleDeactivate,
    isCreating: createMutation.isPending,
    isUpdating: editMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
