
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CollectionPoint, Address } from "@/types/collection-point";
import { Json } from "@/integrations/supabase/types";

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
      let query = supabase
        .from('collection_points')
        .select(`
          *,
          establishment:establishments(name),
          address:address(*)
        `);
      
      if (fetchUnassigned) {
        query = query.is('carrier_id', null);
        
        if (cityFilter) {
          query = query.eq('address.city', cityFilter);
        }
      } else if (establishmentId) {
        query = query.eq('establishment_id', establishmentId);
      } else if (carrierId) {
        query = query.eq('carrier_id', carrierId);
      }
      
      const { data, error } = await query.order('name');

      if (error) {
        toast.error('Erro ao carregar pontos de coleta');
        throw error;
      }

      // Convert the operating_hours from Json to the expected type structure
      return data.map(point => ({
        ...point,
        operating_hours: transformOperatingHours(point.operating_hours as Json)
      })) as (CollectionPoint & { 
        establishment: { name: string } | null,
        address: Address | null
      })[];
    },
    enabled: true
  });

  // Helper function to transform operating hours from Json to expected type
  const transformOperatingHours = (hours: Json | null): CollectionPoint['operating_hours'] => {
    if (!hours) return null;
    
    // Convert from Json to our expected type format
    const result: { [day: string]: { open: string; close: string }[] } = {};
    
    if (typeof hours === 'object' && hours !== null && !Array.isArray(hours)) {
      Object.entries(hours).forEach(([day, periods]) => {
        if (Array.isArray(periods)) {
          result[day] = periods.map(period => {
            // Ensure each period has open and close properties
            if (typeof period === 'object' && period !== null && 'open' in period && 'close' in period) {
              return {
                open: String(period.open),
                close: String(period.close)
              };
            }
            // Default values if structure is unexpected
            return { open: "09:00", close: "17:00" };
          });
        }
      });
    }
    
    return Object.keys(result).length > 0 ? result : null;
  };

  const createMutation = useMutation({
    mutationFn: async (newPoint: Partial<CollectionPoint> & { address?: Partial<Address> }) => {
      // First create or find an address
      const address = newPoint.address;
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
      const { address: _, ...pointData } = newPoint;
      
      const pointToInsert = {
        ...pointData,
        address_id: addressId,
        address: "address", // Placeholder to satisfy the required field
        name: newPoint.name || "Novo Ponto de Coleta", // Ensure name is provided
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
    mutationFn: async (point: Partial<CollectionPoint> & { address?: Partial<Address> }) => {
      if (!point.id) throw new Error('ID do ponto de coleta não fornecido');
      
      // Handle address update
      const address = point.address;
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
      const { establishment, address: _, ...pointData } = point;
      const updateData = {
        ...pointData,
        address_id: addressId,
        carrier_id: pointData.carrier_id || null
      };

      // If the address is changing, update the address string
      if (address && Object.values(address).some(v => v !== null && v !== '')) {
        const formattedAddress = generateAddressString(address);
        updateData.address = formattedAddress;
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

  // Helper function to generate a complete address string from an Address object
  const generateAddressString = (address: Partial<Address> | null): string => {
    if (!address) return 'Sem endereço';
    
    const parts = [];
    
    if (address.street) parts.push(address.street);
    if (address.number) parts.push(address.number);
    if (address.complement) parts.push(address.complement);
    if (address.district) parts.push(`${address.district}`);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.zip_code) parts.push(`CEP: ${address.zip_code}`);
    
    return parts.length > 0 ? parts.join(', ') : 'Sem endereço';
  };

  return {
    collectionPoints,
    isLoading,
    createCollectionPoint: createMutation.mutateAsync,
    updateCollectionPoint: updateMutation.mutateAsync,
    deleteCollectionPoint: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    generateAddressString,
    refetch
  };
}
