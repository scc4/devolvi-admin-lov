
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CollectionPoint } from '@/types/collection-point';
import { toast } from "sonner";

// Keys for React Query cache
const COLLECTION_POINTS_KEYS = {
  all: ['collectionPoints'] as const,
  lists: () => [...COLLECTION_POINTS_KEYS.all, 'list'] as const,
  list: (filters: CollectionPointFilters) => [...COLLECTION_POINTS_KEYS.lists(), filters] as const,
  details: () => [...COLLECTION_POINTS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...COLLECTION_POINTS_KEYS.details(), id] as const,
};

// Type definitions
export interface CollectionPointFilters {
  establishmentId?: string;
  carrierId?: string;
  unassigned?: boolean;
  cityFilter?: string;
}

// Main hook for collection points
export function useCollectionPointsQuery(filters: CollectionPointFilters = {}) {
  const queryClient = useQueryClient();
  
  // Query for fetching collection points with filters
  const {
    data: collectionPoints = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: COLLECTION_POINTS_KEYS.list(filters),
    queryFn: async () => {
      console.log('Fetching collection points with filters:', filters);
      
      let query = supabase
        .from('collection_points')
        .select(`
          *,
          establishment:establishments(name),
          carrier:carriers!collection_points_carrier_id_fkey(name)
        `);
      
      if (filters.unassigned) {
        query = query.is('carrier_id', null);
        if (filters.cityFilter) {
          query = query.eq('city', filters.cityFilter);
        }
      } else if (filters.establishmentId) {
        query = query.eq('establishment_id', filters.establishmentId);
      } else if (filters.carrierId) {
        query = query.eq('carrier_id', filters.carrierId);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) {
        console.error('Error fetching collection points:', error);
        throw error;
      }
      
      return data.map(mapDatabaseToUIModel);
    }
  });
  
  // Mutation for creating a collection point
  const createMutation = useMutation({
    mutationFn: async (collectionPoint: Partial<CollectionPoint>) => {
      const { data, error } = await supabase
        .from('collection_points')
        .insert(mapUIToDatabase(collectionPoint))
        .select('*, establishment:establishments(name)')
        .single();
      
      if (error) {
        console.error('Error creating collection point:', error);
        throw error;
      }
      
      return mapDatabaseToUIModel(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_POINTS_KEYS.lists()
      });
      toast.success("Ponto de coleta criado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao criar ponto de coleta", {
        description: error.message
      });
    }
  });
  
  // Mutation for updating a collection point
  const updateMutation = useMutation({
    mutationFn: async (collectionPoint: Partial<CollectionPoint>) => {
      if (!collectionPoint.id) {
        throw new Error('ID is required for update');
      }
      
      const { data, error } = await supabase
        .from('collection_points')
        .update(mapUIToDatabase(collectionPoint))
        .eq('id', collectionPoint.id)
        .select('*, establishment:establishments(name)')
        .single();
      
      if (error) {
        console.error('Error updating collection point:', error);
        throw error;
      }
      
      return mapDatabaseToUIModel(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_POINTS_KEYS.lists()
      });
      toast.success("Ponto de coleta atualizado com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar ponto de coleta", {
        description: error.message
      });
    }
  });
  
  // Mutation for deleting a collection point
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('collection_points')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting collection point:', error);
        throw error;
      }
      
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_POINTS_KEYS.lists()
      });
      toast.success("Ponto de coleta excluído com sucesso");
    },
    onError: (error) => {
      toast.error("Erro ao excluir ponto de coleta", {
        description: error.message
      });
    }
  });
  
  // Mutation for assigning a carrier to a collection point
  const assignCarrierMutation = useMutation({
    mutationFn: async ({ collectionPointId, carrierId }: { collectionPointId: string, carrierId: string | null }) => {
      const { data, error } = await supabase
        .from('collection_points')
        .update({ carrier_id: carrierId })
        .eq('id', collectionPointId)
        .select('*, establishment:establishments(name)')
        .single();
      
      if (error) {
        console.error('Error assigning carrier to collection point:', error);
        throw error;
      }
      
      return mapDatabaseToUIModel(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: COLLECTION_POINTS_KEYS.lists()
      });
      toast.success(
        "Transportadora atualizada com sucesso"
      );
    },
    onError: (error) => {
      toast.error("Erro ao atualizar transportadora", {
        description: error.message
      });
    }
  });
  
  return {
    collectionPoints,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
    createCollectionPoint: createMutation.mutateAsync,
    updateCollectionPoint: updateMutation.mutateAsync,
    deleteCollectionPoint: deleteMutation.mutateAsync,
    assignCarrier: assignCarrierMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isAssigningCarrier: assignCarrierMutation.isPending
  };
}

// Helper for mapping database record to UI model
function mapDatabaseToUIModel(data: any): CollectionPoint {
  return {
    id: data.id,
    name: data.name,
    address: data.address,
    establishment_id: data.establishment_id,
    establishment: data.establishment,
    carrier_id: data.carrier_id,
    carrier: data.carrier,
    phone: data.phone,
    street: data.street,
    number: data.number,
    complement: data.complement,
    district: data.district,
    zip_code: data.zip_code,
    city: data.city,
    state: data.state,
    latitude: data.latitude,
    longitude: data.longitude,
    is_active: data.is_active,
    operating_hours: data.operating_hours,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

// Helper for mapping UI model to database record
function mapUIToDatabase(data: Partial<CollectionPoint>): any {
  const result: any = {};
  
  // Map only the fields that are defined
  if (data.id !== undefined) result.id = data.id;
  if (data.name !== undefined) result.name = data.name;
  if (data.address !== undefined) result.address = data.address;
  if (data.establishment_id !== undefined) result.establishment_id = data.establishment_id;
  if (data.carrier_id !== undefined) result.carrier_id = data.carrier_id;
  if (data.phone !== undefined) result.phone = data.phone;
  if (data.street !== undefined) result.street = data.street;
  if (data.number !== undefined) result.number = data.number;
  if (data.complement !== undefined) result.complement = data.complement;
  if (data.district !== undefined) result.district = data.district;
  if (data.zip_code !== undefined) result.zip_code = data.zip_code;
  if (data.city !== undefined) result.city = data.city;
  if (data.state !== undefined) result.state = data.state;
  if (data.latitude !== undefined) result.latitude = data.latitude;
  if (data.longitude !== undefined) result.longitude = data.longitude;
  if (data.is_active !== undefined) result.is_active = data.is_active;
  if (data.operating_hours !== undefined) result.operating_hours = data.operating_hours;
  
  // Generate address string if needed
  if (
    (result.street !== undefined || result.number !== undefined || 
     result.city !== undefined || result.state !== undefined) &&
    data.address === undefined
  ) {
    const parts = [];
    if (data.street) parts.push(data.street);
    if (data.number) parts.push(data.number);
    if (data.complement) parts.push(data.complement);
    if (data.district) parts.push(data.district);
    if (data.city) parts.push(data.city);
    if (data.state) parts.push(data.state);
    if (data.zip_code) parts.push(`CEP: ${data.zip_code}`);
    
    result.address = parts.length > 0 ? parts.join(', ') : (data.name || 'Sem endereço');
  }
  
  return result;
}
