
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import type { Carrier } from "@/types/carrier";

// Keys for React Query cache
const CARRIERS_KEYS = {
  all: ['carriers'] as const,
  lists: () => [...CARRIERS_KEYS.all, 'list'] as const,
  list: (filters: any = {}) => [...CARRIERS_KEYS.lists(), filters] as const,
  details: () => [...CARRIERS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CARRIERS_KEYS.details(), id] as const,
};

// Main hook for carriers with collection point counts
export function useCarriersQuery() {
  const queryClient = useQueryClient();
  
  // Query for fetching carriers
  const {
    data: carriers = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: CARRIERS_KEYS.lists(),
    queryFn: async () => {
      console.log('Fetching carriers with collection points count');
      
      // Get carriers with count of collection points
      const { data: carriersData, error: carriersError } = await supabase
        .from('carriers')
        .select(`
          id,
          name,
          city,
          manager,
          phone,
          email,
          is_active,
          created_at,
          updated_at
        `)
        .order('name');
      
      if (carriersError) {
        console.error('Error fetching carriers:', carriersError);
        throw carriersError;
      }
      
      // Get collection points count for each carrier using separate query
      // Instead of using .group(), we'll count manually
      const { data: countData, error: countError } = await supabase
        .from('collection_points')
        .select('carrier_id');
      
      if (countError) {
        console.error('Error counting collection points:', countError);
        throw countError;
      }
      
      // Create a map of carrier ID to count
      const countMap = new Map();
      countData?.forEach(item => {
        const carrierId = item.carrier_id;
        if (carrierId) {
          countMap.set(carrierId, (countMap.get(carrierId) || 0) + 1);
        }
      });
      
      // Merge carrier data with collection point counts
      return carriersData.map(carrier => ({
        id: carrier.id,
        name: carrier.name,
        city: carrier.city,
        manager: carrier.manager,
        phone: carrier.phone,
        email: carrier.email,
        is_active: carrier.is_active,
        created_at: carrier.created_at,
        updated_at: carrier.updated_at,
        // Add the count from our map, or 0 if not found
        collectionPointsCount: countMap.get(carrier.id) || 0
      }));
    }
  });
  
  // Mutation for creating a carrier
  const createMutation = useMutation({
    mutationFn: async (carrier: Partial<Carrier>) => {
      const { data, error } = await supabase
        .from('carriers')
        .insert({
          name: carrier.name,
          city: carrier.city,
          manager: carrier.manager,
          phone: carrier.phone,
          email: carrier.email,
          is_active: carrier.is_active !== undefined ? carrier.is_active : true
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating carrier:', error);
        throw error;
      }
      
      return { ...data, collectionPointsCount: 0 };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CARRIERS_KEYS.lists()
      });
      toast.success("Transportadora cadastrada com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar transportadora", {
        description: error.message
      });
    }
  });
  
  // Mutation for updating a carrier
  const updateMutation = useMutation({
    mutationFn: async (carrier: Carrier) => {
      const { data, error } = await supabase
        .from('carriers')
        .update({
          name: carrier.name,
          city: carrier.city,
          manager: carrier.manager,
          phone: carrier.phone,
          email: carrier.email,
          is_active: carrier.is_active
        })
        .eq('id', carrier.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating carrier:', error);
        throw error;
      }
      
      // Preserve collection points count in the returned data
      return { 
        ...data, 
        collectionPointsCount: carrier.collection_points_count || 0 
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CARRIERS_KEYS.lists()
      });
      toast.success("Transportadora atualizada com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar transportadora", {
        description: error.message
      });
    }
  });
  
  // Mutation for deleting a carrier
  const deleteMutation = useMutation({
    mutationFn: async (carrierId: string) => {
      const { error } = await supabase
        .from('carriers')
        .delete()
        .eq('id', carrierId);
      
      if (error) {
        console.error('Error deleting carrier:', error);
        throw error;
      }
      
      return carrierId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CARRIERS_KEYS.lists()
      });
      toast.success("Transportadora excluída com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao excluir transportadora", {
        description: error.message
      });
    }
  });
  
  // Mutation for deactivating a carrier
  const deactivateMutation = useMutation({
    mutationFn: async (carrierId: string) => {
      const { data, error } = await supabase
        .from('carriers')
        .update({ is_active: false })
        .eq('id', carrierId)
        .select()
        .single();
      
      if (error) {
        console.error('Error deactivating carrier:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: CARRIERS_KEYS.lists()
      });
      toast.success("Transportadora desativada com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao desativar transportadora", {
        description: error.message
      });
    }
  });
  
  // Map database results to UI models
  const uiCarriers = carriers.map(carrierDTO => ({
    id: carrierDTO.id,
    name: carrierDTO.name,
    city: carrierDTO.city,
    manager: carrierDTO.manager,
    phone: carrierDTO.phone,
    email: carrierDTO.email,
    is_active: carrierDTO.is_active,
    collection_points_count: carrierDTO.collectionPointsCount,
    created_at: carrierDTO.created_at,
    updated_at: carrierDTO.updated_at
  }));
  
  return {
    carriers: uiCarriers,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
    handleCreate: createMutation.mutateAsync,
    handleEdit: updateMutation.mutateAsync,
    handleDelete: deleteMutation.mutateAsync,
    handleDeactivate: deactivateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
