
import { useState, useCallback, useEffect } from 'react';
import { toast } from "sonner";
import { CollectionPointDTO } from '../../application/dto/CollectionPointDTO';
import { container } from '../../infrastructure/di/container';
import { collectionPointAdapter } from '../../adapters/collectionPoints/collectionPointAdapter';
import { CollectionPoint as CollectionPointUI } from '../../types/collection-point';

/**
 * Hook to expose collection point-related use cases to the presentation layer using DI
 */
export function useCollectionPointCasesWithDI(filters?: {
  establishmentId?: string;
  carrierId?: string;
  unassigned?: boolean;
  cityFilter?: string;
}) {
  const [collectionPoints, setCollectionPoints] = useState<CollectionPointUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isAssigningCarrier, setIsAssigningCarrier] = useState<boolean>(false);
  
  // Get use cases from container
  const getCollectionPointsUseCase = container.getCollectionPointsUseCase();
  const createCollectionPointUseCase = container.createCollectionPointUseCase();
  const updateCollectionPointUseCase = container.updateCollectionPointUseCase();
  const deleteCollectionPointUseCase = container.deleteCollectionPointUseCase();
  const assignCarrierToCollectionPointUseCase = container.assignCarrierToCollectionPointUseCase();

  const loadCollectionPoints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const collectionPointDTOs = await getCollectionPointsUseCase.execute(filters);
      setCollectionPoints(collectionPointAdapter.toUIModelList(collectionPointDTOs));
    } catch (err) {
      console.error("Error loading collection points:", err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar pontos de coleta';
      setError(errorMessage);
      toast.error("Erro ao carregar pontos de coleta", {
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  }, [getCollectionPointsUseCase, filters]);

  // Load collection points on first render and when filters change
  useEffect(() => {
    loadCollectionPoints();
  }, [loadCollectionPoints]);

  const handleCreate = async (collectionPoint: Partial<CollectionPointUI>) => {
    setIsCreating(true);
    try {
      // Convert UI model to DTO
      const dto = collectionPointAdapter.fromUIModel(collectionPoint);
      
      const result = await createCollectionPointUseCase.execute(dto);

      if (result.success && result.collectionPoint) {
        await loadCollectionPoints(); // Reload collection points to get updated list
        toast.success("Ponto de coleta cadastrado com sucesso");
        return collectionPointAdapter.toUIModel(result.collectionPoint);
      } else {
        toast.error("Erro ao cadastrar ponto de coleta", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error creating collection point:", error);
      toast.error("Erro ao cadastrar ponto de coleta");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (collectionPoint: Partial<CollectionPointUI>) => {
    setIsUpdating(true);
    try {
      // Convert UI model to DTO
      const dto = collectionPointAdapter.fromUIModel(collectionPoint);
      
      const result = await updateCollectionPointUseCase.execute(dto);

      if (result.success && result.collectionPoint) {
        await loadCollectionPoints(); // Reload collection points to get updated list
        toast.success("Ponto de coleta atualizado com sucesso");
        return collectionPointAdapter.toUIModel(result.collectionPoint);
      } else {
        toast.error("Erro ao atualizar ponto de coleta", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error updating collection point:", error);
      toast.error("Erro ao atualizar ponto de coleta");
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (collectionPointId: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteCollectionPointUseCase.execute(collectionPointId);
      
      if (result.success) {
        await loadCollectionPoints(); // Reload collection points to get updated list
        toast.success("Ponto de coleta excluído com sucesso");
      } else {
        toast.error("Erro ao excluir ponto de coleta", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error deleting collection point:", error);
      toast.error("Erro ao excluir ponto de coleta");
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssignCarrier = async (collectionPointId: string, carrierId: string | null) => {
    setIsAssigningCarrier(true);
    try {
      const result = await assignCarrierToCollectionPointUseCase.execute(collectionPointId, carrierId);
      
      if (result.success) {
        await loadCollectionPoints(); // Reload collection points to get updated list
        toast.success(carrierId 
          ? "Transportadora associada com sucesso" 
          : "Transportadora desassociada com sucesso"
        );
      } else {
        toast.error(carrierId 
          ? "Erro ao associar transportadora" 
          : "Erro ao desassociar transportadora", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error assigning carrier to collection point:", error);
      toast.error(carrierId 
        ? "Erro ao associar transportadora" 
        : "Erro ao desassociar transportadora"
      );
      throw error;
    } finally {
      setIsAssigningCarrier(false);
    }
  };

  return {
    collectionPoints,
    loading,
    error,
    loadCollectionPoints,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleAssignCarrier,
    isCreating,
    isUpdating,
    isDeleting,
    isAssigningCarrier
  };
}
