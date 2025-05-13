
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { EstablishmentWithDetails } from '@/types/establishment';

const ESTABLISHMENTS_QUERY_KEY = ['establishments'];

/**
 * Hook for managing establishments data with React Query
 */
export function useEstablishmentsQuery() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch establishments
  const { 
    data: establishments = [], 
    isLoading: loading, 
    error: queryError,
    refetch
  } = useQuery({
    queryKey: ESTABLISHMENTS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('establishments')
        .select(`
          *,
          collection_points(id),
          carrier:carriers(id, name)
        `)
        .order('name');
      
      if (error) throw error;
      
      return data.map(est => ({
        id: est.id,
        name: est.name,
        type: est.type,
        carrier_id: est.carrier_id,
        carrier: est.carrier ? {
          id: est.carrier.id,
          name: est.carrier.name
        } : null,
        created_at: est.created_at,
        updated_at: est.updated_at,
        collection_points_count: est.collection_points ? est.collection_points.length : 0
      })) as EstablishmentWithDetails[];
    }
  });
  
  // Error handling
  const error = queryError ? 
    (queryError instanceof Error ? queryError.message : 'Error loading establishments') 
    : null;
  
  // Create establishment mutation
  const createMutation = useMutation({
    mutationFn: async (newEstablishment: Partial<EstablishmentWithDetails>) => {
      const { data, error } = await supabase
        .from('establishments')
        .insert({
          name: newEstablishment.name,
          type: newEstablishment.type,
          carrier_id: newEstablishment.carrier_id || null
        })
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
      queryClient.invalidateQueries({ queryKey: ESTABLISHMENTS_QUERY_KEY });
      toast.success("Estabelecimento cadastrado com sucesso");
    },
    onError: (error) => {
      console.error("Error creating establishment:", error);
      toast.error("Erro ao cadastrar estabelecimento");
    }
  });
  
  // Update establishment mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedEstablishment: EstablishmentWithDetails) => {
      const { data, error } = await supabase
        .from('establishments')
        .update({
          name: updatedEstablishment.name,
          type: updatedEstablishment.type,
          carrier_id: updatedEstablishment.carrier_id
        })
        .eq('id', updatedEstablishment.id)
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
      queryClient.invalidateQueries({ queryKey: ESTABLISHMENTS_QUERY_KEY });
      toast.success("Estabelecimento atualizado com sucesso");
    },
    onError: (error) => {
      console.error("Error updating establishment:", error);
      toast.error("Erro ao atualizar estabelecimento");
    }
  });
  
  // Delete establishment mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('establishments')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ESTABLISHMENTS_QUERY_KEY });
      toast.success("Estabelecimento excluído com sucesso");
    },
    onError: (error) => {
      console.error("Error deleting establishment:", error);
      toast.error("Erro ao excluir estabelecimento");
    }
  });
  
  // Filter establishments based on search term
  const filteredEstablishments = searchTerm 
    ? establishments.filter(est => 
        est.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.type?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : establishments;
  
  return {
    establishments: filteredEstablishments,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refetchEstablishments: refetch,
    createEstablishment: createMutation.mutateAsync,
    updateEstablishment: updateMutation.mutateAsync,
    deleteEstablishment: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
