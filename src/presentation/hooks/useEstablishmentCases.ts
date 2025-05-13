import { useState, useCallback, useEffect } from 'react';
import { toast } from "sonner";
import { EstablishmentDTO } from '../../application/dto/EstablishmentDTO';
import { container } from '../../infrastructure/di/container';
import { establishmentAdapter } from '../../adapters/establishments/establishmentAdapter';
import { EstablishmentWithDetails } from '../../types/establishment';

/**
 * Hook to expose establishment-related use cases to the presentation layer using DI
 */
export function useEstablishmentCases() {
  const [establishments, setEstablishments] = useState<EstablishmentWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Get use cases from container
  const getAllEstablishmentsUseCase = container.getAllEstablishmentsUseCase();
  const createEstablishmentUseCase = container.createEstablishmentUseCase();
  const updateEstablishmentUseCase = container.updateEstablishmentUseCase();
  const deleteEstablishmentUseCase = container.deleteEstablishmentUseCase();

  const loadEstablishments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const establishmentDTOs = await getAllEstablishmentsUseCase.execute();
      setEstablishments(establishmentAdapter.toUIModelList(establishmentDTOs));
    } catch (err) {
      console.error("Error loading establishments:", err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar estabelecimentos';
      setError(errorMessage);
      toast.error("Erro ao carregar estabelecimentos", {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [getAllEstablishmentsUseCase]);

  // Load establishments on first render using useEffect
  useEffect(() => {
    loadEstablishments();
  }, [loadEstablishments]);

  const handleCreate = async (establishment: Partial<EstablishmentWithDetails>) => {
    setIsCreating(true);
    try {
      if (!establishment.name || !establishment.type) {
        throw new Error('Nome e tipo do estabelecimento são obrigatórios');
      }
      
      const result = await createEstablishmentUseCase.execute({
        name: establishment.name,
        type: establishment.type,
        carrierId: establishment.carrier_id
      });

      if (result.success && result.establishment) {
        await loadEstablishments(); // Reload establishments to get updated list
        toast.success("Estabelecimento cadastrado com sucesso");
        return establishmentAdapter.toUIModel(result.establishment);
      } else {
        toast.error("Erro ao cadastrar estabelecimento", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error creating establishment:", error);
      toast.error("Erro ao cadastrar estabelecimento");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = async (establishment: EstablishmentWithDetails) => {
    setIsUpdating(true);
    try {
      const dto = establishmentAdapter.toDomainDTO(establishment);
      
      const result = await updateEstablishmentUseCase.execute({
        id: dto.id,
        name: dto.name,
        type: dto.type,
        carrierId: dto.carrierId
      });

      if (result.success) {
        await loadEstablishments(); // Reload establishments to get updated list
        toast.success("Estabelecimento atualizado com sucesso");
      } else {
        toast.error("Erro ao atualizar estabelecimento", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error updating establishment:", error);
      toast.error("Erro ao atualizar estabelecimento");
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (establishment: EstablishmentWithDetails) => {
    setIsDeleting(true);
    try {
      const result = await deleteEstablishmentUseCase.execute(establishment.id);
      
      if (result.success) {
        await loadEstablishments(); // Reload establishments to get updated list
        toast.success("Estabelecimento excluído com sucesso");
      } else {
        toast.error("Erro ao excluir estabelecimento", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error deleting establishment:", error);
      toast.error("Erro ao excluir estabelecimento");
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    establishments,
    loading,
    error,
    loadEstablishments,
    handleCreate,
    handleEdit,
    handleDelete,
    isCreating,
    isUpdating,
    isDeleting
  };
}
