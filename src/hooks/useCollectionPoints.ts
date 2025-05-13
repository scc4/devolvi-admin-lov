import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CollectionPoint } from "@/types/collection-point";
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
          establishment:establishments(name)
        `);
      
      if (fetchUnassigned) {
        query = query.is('carrier_id', null);
        
        if (cityFilter) {
          query = query.eq('city', cityFilter);
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
      })) as (CollectionPoint & { establishment: { name: string } | null })[];
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
    mutationFn: async (newPoint: Partial<CollectionPoint>) => {
      // Validação mínima necessária
      if (!newPoint.name) throw new Error('Nome do ponto de coleta não fornecido');
      
      // Prepare data for insertion, ensuring carrier_id is null if empty
      const pointData = {
        establishment_id: newPoint.establishment_id || null,
        name: newPoint.name,
        // Set address to a string based on available address fields
        address: generateAddressString(newPoint),
        carrier_id: newPoint.carrier_id || null, // Set to null if empty
        phone: newPoint.phone || null,
        street: newPoint.street || null,
        number: newPoint.number || null,
        complement: newPoint.complement || null,
        district: newPoint.district || null,
        zip_code: newPoint.zip_code || null,
        city: newPoint.city || null,
        state: newPoint.state || null,
        latitude: newPoint.latitude || null,
        longitude: newPoint.longitude || null,
        is_active: newPoint.is_active ?? true,
        operating_hours: newPoint.operating_hours || null
      };
      
      const { data, error } = await supabase
        .from('collection_points')
        .insert(pointData)
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
      // Verificar erros específicos
      if (error.message && error.message.includes('duplicate key') && 
          error.message.includes('collection_points_phone_unique')) {
        toast.error('Número de telefone já cadastrado em outro ponto de coleta');
      } else {
        toast.error('Erro ao cadastrar ponto de coleta');
      }
      console.error('Error creating collection point:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (point: Partial<CollectionPoint>) => {
      if (!point.id) throw new Error('ID do ponto de coleta não fornecido');
      
      const { establishment, ...pointData } = point;
      const updateData = {
        ...pointData,
        // Set address to a string based on available address fields
        address: generateAddressString(point),
        carrier_id: pointData.carrier_id || null
      };

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
      // Verificar erros específicos de unicidade
      if (error.message && error.message.includes('duplicate key') && 
          error.message.includes('collection_points_phone_unique')) {
        throw error; // Repassar o erro para ser tratado no componente
      } else {
        toast.error('Erro ao atualizar ponto de coleta');
        console.error('Error updating collection point:', error);
      }
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
      queryClient.invalidateQueries({ queryKey: ['collection-points'] });
      toast.success('Ponto de coleta excluído com sucesso');
    },
    onError: (error) => {
      toast.error('Erro ao excluir ponto de coleta');
      console.error('Error deleting collection point:', error);
    }
  });

  // Helper function to generate a complete address string from individual fields
  const generateAddressString = (point: Partial<CollectionPoint>): string => {
    const parts = [];
    
    if (point.street) parts.push(point.street);
    if (point.number) parts.push(point.number);
    if (point.complement) parts.push(point.complement);
    if (point.district) parts.push(`${point.district}`);
    if (point.city) parts.push(point.city);
    if (point.state) parts.push(point.state);
    if (point.zip_code) parts.push(`CEP: ${point.zip_code}`);
    
    return parts.length > 0 ? parts.join(', ') : point.name || 'Sem endereço';
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
    refetch
  };
}
