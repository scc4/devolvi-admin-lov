
import { useState, useCallback, useEffect, useRef } from 'react';
import { CarrierDTO } from '../../application/dto/CarrierDTO';
import { container } from '../../infrastructure/di/container';
import { carrierAdapter } from '../../adapters/carriers/carrierAdapter';
import { toast } from 'sonner';

/**
 * Hook to expose carrier-related use cases to the presentation layer using DI
 */
export function useCarrierCases() {
  const [carriers, setCarriers] = useState<CarrierDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Use useRef to prevent recreation of use cases
  const useCasesRef = useRef({
    getAllCarriersUseCase: container.getAllCarriersUseCase(),
    createCarrierUseCase: container.createCarrierUseCase(),
    updateCarrierUseCase: container.updateCarrierUseCase(),
    deleteCarrierUseCase: container.deleteCarrierUseCase(),
    deactivateCarrierUseCase: container.deactivateCarrierUseCase()
  });
  
  // Flag para controlar se o componente está montado
  const isMounted = useRef(true);

  // Limpar a flag quando o componente for desmontado
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadCarriers = useCallback(async () => {
    if (!isMounted.current) return;
    
    console.log("Loading carriers...");
    setLoading(true);
    setError(null);
    
    try {
      const carrierDTOs = await useCasesRef.current.getAllCarriersUseCase.execute();
      console.log("Carriers with collection points count:", carrierDTOs);
      
      if (isMounted.current) {
        setCarriers(carrierDTOs);
      }
    } catch (err) {
      console.error("Error loading carriers:", err);
      
      if (isMounted.current) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar transportadoras';
        setError(errorMessage);
        toast.error("Erro ao carregar transportadoras", {
          description: errorMessage
        });
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []); // Sem dependências para evitar loops

  // Load carriers on mount
  useEffect(() => {
    loadCarriers();
  }, [loadCarriers]);

  const handleCreate = async (carrier: Partial<CarrierDTO>) => {
    if (!isMounted.current) return;
    
    // Validate required fields from CreateCarrierInput
    if (!carrier.name) {
      toast.error("Nome da transportadora é obrigatório");
      return;
    }
    
    if (!carrier.city) {
      toast.error("Cidade é obrigatória");
      return;
    }
    
    if (!carrier.manager) {
      toast.error("Gerente é obrigatório");
      return;
    }
    
    setIsCreating(true);
    try {
      // Convert partial DTO to CreateCarrierInput
      const createInput = {
        name: carrier.name,
        city: carrier.city,
        manager: carrier.manager,
        phone: carrier.phone || null,
        email: carrier.email || null,
        isActive: carrier.isActive !== undefined ? carrier.isActive : true
      };
      
      const result = await useCasesRef.current.createCarrierUseCase.execute(createInput);
      if (result.success && result.carrier) {
        await loadCarriers(); // Reload carriers
        toast.success("Transportadora criada com sucesso");
        return result.carrier;
      } else {
        toast.error("Erro ao criar transportadora", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error creating carrier:", error);
      toast.error("Erro ao criar transportadora");
      throw error;
    } finally {
      if (isMounted.current) {
        setIsCreating(false);
      }
    }
  };

  const handleEdit = async (carrier: CarrierDTO) => {
    if (!isMounted.current) return;
    
    setIsUpdating(true);
    try {
      const result = await useCasesRef.current.updateCarrierUseCase.execute(carrier);
      if (result.success) {
        await loadCarriers(); // Reload carriers
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
      if (isMounted.current) {
        setIsUpdating(false);
      }
    }
  };

  const handleDelete = async (carrier: CarrierDTO) => {
    if (!isMounted.current) return;
    
    setIsDeleting(true);
    try {
      const result = await useCasesRef.current.deleteCarrierUseCase.execute(carrier.id);
      if (result.success) {
        await loadCarriers(); // Reload carriers
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
      if (isMounted.current) {
        setIsDeleting(false);
      }
    }
  };

  const handleDeactivate = async (carrier: CarrierDTO) => {
    if (!isMounted.current) return;
    
    try {
      const result = await useCasesRef.current.deactivateCarrierUseCase.execute(carrier.id);
      if (result.success) {
        await loadCarriers(); // Reload carriers
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
