
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { CarrierDTO } from '../../application/dto/CarrierDTO';
import { container } from '../../infrastructure/di/container';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to expose carrier-related use cases to the presentation layer using DI
 */
export function useCarrierCasesWithDI() {
  const [carriers, setCarriers] = useState<CarrierDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Flag para controlar carregamento inicial
  const isMountedRef = useRef(true);
  const hasInitialLoadRef = useRef(false);
  
  // Get use cases from container
  const getAllCarriersUseCase = container.getAllCarriersUseCase();
  const createCarrierUseCase = container.createCarrierUseCase();
  const updateCarrierUseCase = container.updateCarrierUseCase();
  const deleteCarrierUseCase = container.deleteCarrierUseCase();
  const deactivateCarrierUseCase = container.deactivateCarrierUseCase();

  // Limpar a flag quando o componente for desmontado
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadCarriers = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    // Evitar carregamentos duplicados
    if (hasInitialLoadRef.current && !loading) {
      console.log("Skipping repeated carriers load");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // 1. Get all carriers from the use case
      const carrierDTOs = await getAllCarriersUseCase.execute();
      
      // 2. Load collection points count for each carrier
      const carriersWithCounts = await Promise.all(
        carrierDTOs.map(async (carrier) => {
          // Query to count collection points for this carrier
          const { count, error: countError } = await supabase
            .from('collection_points')
            .select('*', { count: 'exact', head: true })
            .eq('carrier_id', carrier.id);
          
          if (countError) {
            console.error(`Error counting collection points for carrier ${carrier.id}:`, countError);
          }
          
          // Return carrier with count information
          return {
            ...carrier,
            collectionPointsCount: count || 0
          };
        })
      );
      
      console.log("Carriers with collection points count:", carriersWithCounts);
      
      if (isMountedRef.current) {
        setCarriers(carriersWithCounts);
        hasInitialLoadRef.current = true;
      }
    } catch (err) {
      console.error("Error loading carriers:", err);
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar transportadoras';
        setError(errorMessage);
        toast.error("Erro ao carregar transportadoras", {
          description: errorMessage
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [getAllCarriersUseCase, loading]);

  // Load carriers on first render using useEffect
  useEffect(() => {
    if (!hasInitialLoadRef.current) {
      loadCarriers();
    }
  }, [loadCarriers]);

  const handleCreate = async (carrier: Partial<CarrierDTO>) => {
    setIsCreating(true);
    try {
      const result = await createCarrierUseCase.execute({
        name: carrier.name || '',
        city: carrier.city || '',
        manager: carrier.manager || '',
        phone: carrier.phone,
        email: carrier.email,
        isActive: carrier.isActive !== undefined ? carrier.isActive : true
      });

      if (result.success && result.carrier) {
        await loadCarriers(); // Reload carriers to get updated list
        toast.success("Transportadora cadastrada com sucesso");
        return result.carrier;
      } else {
        toast.error("Erro ao cadastrar transportadora", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error creating carrier:", error);
      toast.error("Erro ao cadastrar transportadora");
      throw error;
    } finally {
      if (isMountedRef.current) {
        setIsCreating(false);
      }
    }
  };

  const handleEdit = async (carrier: CarrierDTO) => {
    setIsUpdating(true);
    try {
      const result = await updateCarrierUseCase.execute({
        id: carrier.id,
        name: carrier.name,
        city: carrier.city,
        manager: carrier.manager,
        phone: carrier.phone,
        email: carrier.email,
        isActive: carrier.isActive
      });

      if (result.success) {
        await loadCarriers(); // Reload carriers to get updated list
        toast.success("Transportadora atualizada com sucesso");
      } else {
        toast.error("Erro ao atualizar transportadora", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error updating carrier:", error);
      toast.error("Erro ao atualizar transportadora");
      throw error;
    } finally {
      if (isMountedRef.current) {
        setIsUpdating(false);
      }
    }
  };

  const handleDelete = async (carrier: CarrierDTO) => {
    setIsDeleting(true);
    try {
      const result = await deleteCarrierUseCase.execute(carrier.id);
      
      if (result.success) {
        await loadCarriers(); // Reload carriers to get updated list
        toast.success("Transportadora excluída com sucesso");
      } else {
        toast.error("Erro ao excluir transportadora", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error deleting carrier:", error);
      toast.error("Erro ao excluir transportadora");
      throw error;
    } finally {
      if (isMountedRef.current) {
        setIsDeleting(false);
      }
    }
  };

  const handleDeactivate = async (carrier: CarrierDTO) => {
    setIsUpdating(true);
    try {
      const result = await deactivateCarrierUseCase.execute(carrier.id);
      
      if (result.success) {
        await loadCarriers(); // Reload carriers to get updated list
        toast.success("Transportadora desativada com sucesso");
      } else {
        toast.error("Erro ao desativar transportadora", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error deactivating carrier:", error);
      toast.error("Erro ao desativar transportadora");
      throw error;
    } finally {
      if (isMountedRef.current) {
        setIsUpdating(false);
      }
    }
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
    isCreating,
    isUpdating,
    isDeleting
  };
}
