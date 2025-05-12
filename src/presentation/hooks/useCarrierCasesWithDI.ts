
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { CarrierDTO } from '../../application/dto/CarrierDTO';
import { container } from '../../infrastructure/di/container';

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
  
  // Get use cases from container
  const getAllCarriersUseCase = container.getAllCarriersUseCase();
  const createCarrierUseCase = container.createCarrierUseCase();
  const updateCarrierUseCase = container.updateCarrierUseCase();
  const deleteCarrierUseCase = container.deleteCarrierUseCase();
  const deactivateCarrierUseCase = container.deactivateCarrierUseCase();

  const loadCarriers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const carrierDTOs = await getAllCarriersUseCase.execute();
      setCarriers(carrierDTOs);
    } catch (err) {
      console.error("Error loading carriers:", err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar transportadoras';
      setError(errorMessage);
      toast.error("Erro ao carregar transportadoras", {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [getAllCarriersUseCase]);

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
      setIsCreating(false);
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
      setIsUpdating(false);
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
      setIsDeleting(false);
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
      setIsUpdating(false);
    }
  };

  // Load carriers on first render
  useCallback(() => {
    loadCarriers();
  }, [loadCarriers])();

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
