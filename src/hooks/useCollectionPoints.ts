import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { CollectionPoint, Address } from "@/types/collection-point";
import { getFullAddress } from "@/components/establishments/collection-points/utils/addressHelpers";

export function useCollectionPoints(
  establishmentId?: string | null, 
  carrierId?: string | null,
  fetchUnassigned?: boolean,
  cityFilter?: string
) {
  const queryClient = useQueryClient();
  
  const { data: collectionPoints = [], isLoading, refetch } = useQuery({
    queryKey: ['collection-points', establishmentId, carrierId, fetchUnassigned, cityFilter],
    queryFn: async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams();
        
        if (establishmentId) params.append('establishmentId', establishmentId);
        if (carrierId) params.append('carrierId', carrierId);
        if (fetchUnassigned) params.append('fetchUnassigned', 'true');
        if (cityFilter) params.append('cityFilter', cityFilter);
        
        const queryString = params.toString();
        const url = queryString ? `get-collection-points?${queryString}` : 'get-collection-points';
        
        console.log(`Fetching collection points with URL: ${url}`);
        
        // Call the edge function
        const response = await supabase.functions.invoke(url, {
          method: 'GET'
        });
        
        if (response.error) {
          console.error('Edge function error:', response.error);
          toast.error('Erro ao carregar pontos de coleta');
          throw response.error;
        }

        const data = response.data;
        console.log('Edge function response data:', data);
        
        // Validate the response data
        if (!Array.isArray(data)) {
          console.error('Invalid response format, expected array:', data);
          toast.error('Formato de resposta inválido');
          return [];
        }
        
        // Process and validate each collection point
        const validatedPoints = data.map((point: any) => {
          // Ensure address_obj is properly set
          if (!point.address_obj && point.address) {
            console.warn(`Point ${point.id} missing address_obj but has address string:`, point.address);
          }
          
          // Log address data for debugging
          console.log(`Point ${point.id} address_obj:`, point.address_obj);
          
          return point as CollectionPoint;
        });
        
        return validatedPoints;
      } catch (error) {
        console.error('Collection points fetch error:', error);
        toast.error('Erro ao carregar pontos de coleta');
        throw error;
      }
    },
    enabled: true
  });

  // Rest of the hook (mutations) remains the same
  const createMutation = useMutation({
    mutationFn: async (newPoint: Partial<CollectionPoint> & { address_obj?: Partial<Address> }) => {
      // First create or find an address
      const address = newPoint.address_obj;
      let addressId = newPoint.address_id;
      
      if (address && !addressId) {
        // Create a new address
        const { data: addressData, error: addressError } = await supabase
          .from('address')
          .insert({
            street: address.street || null,
            number: address.number || null,
            complement: address.complement || null,
            district: address.district || null,
            city: address.city || null,
            state: address.state || null,
            zip_code: address.zip_code || null,
            latitude: address.latitude || null,
            longitude: address.longitude || null
          })
          .select('id')
          .single();
          
        if (addressError) {
          toast.error('Erro ao criar endereço');
          throw addressError;
        }
        
        addressId = addressData.id;
      }
      
      // Then create the collection point with the address ID
      const { address_obj: _, ...pointData } = newPoint;
      
      // Generate address string for display from address_obj data
      let formattedAddress = "Sem endereço";
      if (address) {
        const addressPoint = { address_obj: address } as CollectionPoint;
        formattedAddress = getFullAddress(addressPoint);
      }
      
      const pointToInsert = {
        ...pointData,
        address_id: addressId,
        address: formattedAddress,
        name: newPoint.name || "Novo Ponto de Coleta", 
        establishment_id: newPoint.establishment_id || null,
        carrier_id: newPoint.carrier_id || null,
        is_active: newPoint.is_active ?? true
      };
      
      const { data, error } = await supabase
        .from('collection_points')
        .insert(pointToInsert)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-points'] });
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
    mutationFn: async (point: Partial<CollectionPoint> & { address_obj?: Partial<Address> }) => {
      if (!point.id) throw new Error('ID do ponto de coleta não fornecido');
      
      // Handle address update
      const address = point.address_obj;
      let addressId = point.address_id;
      
      if (address) {
        if (addressId) {
          // Update existing address
          const { error: addressUpdateError } = await supabase
            .from('address')
            .update({
              street: address.street || null,
              number: address.number || null,
              complement: address.complement || null,
              district: address.district || null,
              city: address.city || null,
              state: address.state || null,
              zip_code: address.zip_code || null,
              latitude: address.latitude || null,
              longitude: address.longitude || null
            })
            .eq('id', addressId);
            
          if (addressUpdateError) {
            toast.error('Erro ao atualizar endereço');
            throw addressUpdateError;
          }
        } else {
          // Create a new address
          const { data: addressData, error: addressError } = await supabase
            .from('address')
            .insert({
              street: address.street || null,
              number: address.number || null,
              complement: address.complement || null,
              district: address.district || null,
              city: address.city || null,
              state: address.state || null,
              zip_code: address.zip_code || null,
              latitude: address.latitude || null,
              longitude: address.longitude || null
            })
            .select('id')
            .single();
            
          if (addressError) {
            toast.error('Erro ao criar endereço');
            throw addressError;
          }
          
          addressId = addressData.id;
        }
      }
      
      // Update the collection point
      const { establishment, address_obj: _, ...pointData } = point;
      const updateData = {
        ...pointData,
        address_id: addressId,
        carrier_id: pointData.carrier_id || null
      };

      // If the address is changing, update the address string
      if (address && Object.values(address).some(v => v !== null && v !== '')) {
        const addressPoint = { address_obj: address } as CollectionPoint;
        updateData.address = getFullAddress(addressPoint);
      }

      const { data, error } = await supabase
        .from('collection_points')
        .update(updateData)
        .eq('id', point.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-points'] });
      toast.success('Ponto de coleta atualizado com sucesso');
    },
    onError: (error: any) => {
      if (error.message?.includes('duplicate key') && error.message?.includes('collection_points_phone_unique')) {
        throw error;
      } else {
        toast.error('Erro ao atualizar ponto de coleta');
        console.error('Error updating collection point:', error);
      }
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (pointId: string) => {
      // Get the collection point to find its address_id
      const { data: point } = await supabase
        .from('collection_points')
        .select('address_id')
        .eq('id', pointId)
        .single();
        
      const addressId = point?.address_id;
      
      // Delete the collection point first
      const { error } = await supabase
        .from('collection_points')
        .delete()
        .eq('id', pointId);

      if (error) throw error;
      
      // Optionally delete the address if it's not used by other collection points
      if (addressId) {
        const { data: otherPoints } = await supabase
          .from('collection_points')
          .select('id')
          .eq('address_id', addressId);
          
        if (!otherPoints?.length) {
          await supabase
            .from('address')
            .delete()
            .eq('id', addressId);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection-points'] });
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
