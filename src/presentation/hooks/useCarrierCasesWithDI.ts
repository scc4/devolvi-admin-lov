
import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { CarrierDTO } from '../../application/dto/CarrierDTO';
import { container } from '../../infrastructure/di/container';

/**
 * Hook to expose carrier-related use cases to the presentation layer using DI
 */
export function useCarrierCasesWithDI() {
  const [carriers, setCarriers] = useState<CarrierDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
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
      toast({ 
        title: "Erro ao carregar transportadoras", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }, [getAllCarriersUseCase, toast]);

  useEffect(() => {
    loadCarriers();
  }, [loadCarriers]);

  const handleCreate = async (carrierData: {
    name: string;
    city: string;
    manager: string;
    phone?: string | null;
    email?: string | null;
    isActive?: boolean;
  }): Promise<{ success: boolean; carrier?: CarrierDTO }> => {
    try {
      const result = await createCarrierUseCase.execute(carrierData);
      
      if (result.success && result.carrier) {
        toast({
          title: "Transportadora criada",
          description: "A transportadora foi criada com sucesso."
        });
        await loadCarriers(); // Refresh the list
        return { success: true, carrier: result.carrier };
      } else {
        toast({
          title: "Erro ao criar transportadora",
          description: result.error?.message || "Ocorreu um erro inesperado.",
          variant: "destructive"
        });
        return { success: false };
      }
    } catch (error) {
      console.error("Error creating carrier:", error);
      toast({
        title: "Erro ao criar transportadora",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const handleUpdate = async (carrierId: string, carrierData: {
    name?: string;
    city?: string;
    manager?: string;
    phone?: string | null;
    email?: string | null;
    isActive?: boolean;
  }): Promise<{ success: boolean; carrier?: CarrierDTO }> => {
    try {
      const result = await updateCarrierUseCase.execute({
        id: carrierId,
        ...carrierData
      });
      
      if (result.success && result.carrier) {
        toast({
          title: "Transportadora atualizada",
          description: "A transportadora foi atualizada com sucesso."
        });
        await loadCarriers(); // Refresh the list
        return { success: true, carrier: result.carrier };
      } else {
        toast({
          title: "Erro ao atualizar transportadora",
          description: result.error?.message || "Ocorreu um erro inesperado.",
          variant: "destructive"
        });
        return { success: false };
      }
    } catch (error) {
      console.error("Error updating carrier:", error);
      toast({
        title: "Erro ao atualizar transportadora",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const handleDelete = async (carrierId: string): Promise<{ success: boolean }> => {
    try {
      const result = await deleteCarrierUseCase.execute(carrierId);
      
      if (result.success) {
        toast({
          title: "Transportadora excluída",
          description: "A transportadora foi excluída com sucesso."
        });
        await loadCarriers(); // Refresh the list
        return { success: true };
      } else {
        toast({
          title: "Erro ao excluir transportadora",
          description: result.error?.message || "Ocorreu um erro inesperado.",
          variant: "destructive"
        });
        return { success: false };
      }
    } catch (error) {
      console.error("Error deleting carrier:", error);
      toast({
        title: "Erro ao excluir transportadora",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const handleDeactivate = async (carrierId: string): Promise<{ success: boolean }> => {
    try {
      const result = await deactivateCarrierUseCase.execute(carrierId);
      
      if (result.success) {
        toast({
          title: "Transportadora desativada",
          description: "A transportadora foi desativada com sucesso."
        });
        await loadCarriers(); // Refresh the list
        return { success: true };
      } else {
        toast({
          title: "Erro ao desativar transportadora",
          description: result.error?.message || "Ocorreu um erro inesperado.",
          variant: "destructive"
        });
        return { success: false };
      }
    } catch (error) {
      console.error("Error deactivating carrier:", error);
      toast({
        title: "Erro ao desativar transportadora",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  return {
    carriers,
    loading,
    error,
    loadCarriers,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleDeactivate
  };
}
