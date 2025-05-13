
import { useState, useCallback, useEffect, useRef } from 'react';
import { container } from '../../infrastructure/di/container';
import { collectionPointAdapter } from '../../adapters/collectionPoints/collectionPointAdapter';
import { CollectionPoint } from '../../types/collection-point';
import { toast } from 'sonner';

interface UseCollectionPointCasesProps {
  establishmentId?: string;
  carrierId?: string;
  unassigned?: boolean;
  cityFilter?: string;
}

/**
 * Hook to expose collection point-related use cases to the presentation layer using DI
 */
export function useCollectionPointCases(props?: UseCollectionPointCasesProps) {
  const { establishmentId, carrierId, unassigned, cityFilter } = props || {};
  
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isAssigningCarrier, setIsAssigningCarrier] = useState<boolean>(false);
  
  // Use useRef para evitar recreações dos use cases
  const useCasesRef = useRef({
    getCollectionPointsUseCase: container.getCollectionPointsUseCase(),
    createCollectionPointUseCase: container.createCollectionPointUseCase(),
    updateCollectionPointUseCase: container.updateCollectionPointUseCase(),
    deleteCollectionPointUseCase: container.deleteCollectionPointUseCase(),
    assignCarrierToCollectionPointUseCase: container.assignCarrierToCollectionPointUseCase()
  });
  
  // Flag para controlar se o componente está montado
  const isMounted = useRef(true);

  // Store filter params in ref to avoid dependency issues
  const filtersRef = useRef({
    establishmentId,
    carrierId,
    unassigned,
    cityFilter
  });

  // Update filter refs when props change
  useEffect(() => {
    filtersRef.current = {
      establishmentId,
      carrierId,
      unassigned,
      cityFilter
    };
  }, [establishmentId, carrierId, unassigned, cityFilter]);

  // Limpar a flag quando o componente for desmontado
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadCollectionPoints = useCallback(async () => {
    if (!isMounted.current) return;
    
    console.log("Loading collection points with filters:", filtersRef.current);
    setLoading(true);
    setError(null);
    
    try {
      const filters = {
        establishmentId: filtersRef.current.establishmentId,
        carrierId: filtersRef.current.carrierId,
        unassigned: filtersRef.current.unassigned,
        cityFilter: filtersRef.current.cityFilter
      };
      
      const dtos = await useCasesRef.current.getCollectionPointsUseCase.execute(filters);
      console.log(`Retrieved ${dtos.length} collection points`);
      
      if (isMounted.current) {
        setCollectionPoints(collectionPointAdapter.toUIModelList(dtos));
      }
    } catch (err) {
      console.error("Error loading collection points:", err);
      
      if (isMounted.current) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar pontos de coleta';
        setError(errorMessage);
        toast.error("Erro ao carregar pontos de coleta", {
          description: errorMessage
        });
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []); // Sem dependências para evitar loops

  // Load collection points on first render and when filters change
  useEffect(() => {
    loadCollectionPoints();
  }, [loadCollectionPoints]);

  const handleCreate = async (collectionPoint: any) => {
    if (!isMounted.current) return;
    
    setIsCreating(true);
    try {
      const result = await useCasesRef.current.createCollectionPointUseCase.execute(collectionPoint);
      
      if (result.success && result.collectionPoint) {
        await loadCollectionPoints(); // Reload collection points
        toast.success("Ponto de coleta criado com sucesso");
        return collectionPointAdapter.toUIModel(result.collectionPoint);
      } else {
        toast.error("Erro ao criar ponto de coleta", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error creating collection point:", error);
      toast.error("Erro ao criar ponto de coleta");
      throw error;
    } finally {
      if (isMounted.current) {
        setIsCreating(false);
      }
    }
  };

  const handleUpdate = async (collectionPoint: any) => {
    if (!isMounted.current) return;
    
    setIsUpdating(true);
    try {
      const result = await useCasesRef.current.updateCollectionPointUseCase.execute(collectionPoint);
      
      if (result.success) {
        await loadCollectionPoints(); // Reload collection points
        toast.success("Ponto de coleta atualizado com sucesso");
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
      if (isMounted.current) {
        setIsUpdating(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!isMounted.current) return;
    
    setIsDeleting(true);
    try {
      const result = await useCasesRef.current.deleteCollectionPointUseCase.execute(id);
      
      if (result.success) {
        await loadCollectionPoints(); // Reload collection points
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
      if (isMounted.current) {
        setIsDeleting(false);
      }
    }
  };

  const handleAssignCarrier = async (collectionPointId: string, carrierId: string | null) => {
    if (!isMounted.current) return;
    
    setIsAssigningCarrier(true);
    try {
      const result = await useCasesRef.current.assignCarrierToCollectionPointUseCase.execute({
        collectionPointId,
        carrierId
      });
      
      if (result.success) {
        await loadCollectionPoints(); // Reload collection points
        toast.success(carrierId 
          ? "Transportadora associada com sucesso" 
          : "Transportadora desassociada com sucesso"
        );
      } else {
        toast.error(carrierId 
          ? "Erro ao associar transportadora" 
          : "Erro ao desassociar transportadora", 
          {
            description: result.error?.message
          }
        );
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
      if (isMounted.current) {
        setIsAssigningCarrier(false);
      }
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
