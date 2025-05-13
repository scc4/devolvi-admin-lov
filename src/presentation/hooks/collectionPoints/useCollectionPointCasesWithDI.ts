import { useEffect, useRef, useState, useCallback } from 'react';
import { container } from '../../../infrastructure/di/container';
import { useLoadCollectionPoints } from './useLoadCollectionPoints';
import { useCreateCollectionPoint } from './useCreateCollectionPoint';
import { useUpdateCollectionPoint } from './useUpdateCollectionPoint';
import { useDeleteCollectionPoint } from './useDeleteCollectionPoint';
import { useAssignCarrier } from './useAssignCarrier';
import { toast } from "sonner";

/**
 * Hook principal que expõe casos de uso relacionados a pontos de coleta
 * usando injeção de dependência - Versão refatorada com gerenciamento de estado simplificado
 */
export function useCollectionPointCasesWithDI(filters?: {
  establishmentId?: string;
  carrierId?: string;
  unassigned?: boolean;
  cityFilter?: string;
}) {
  // Keep track of component mount status
  const isMountedRef = useRef(true);
  
  // Track operation states
  const [operationStates, setOperationStates] = useState({
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isAssigningCarrier: false
  });
  
  // Obter casos de uso do container
  const getCollectionPointsUseCase = container.getCollectionPointsUseCase();
  const createCollectionPointUseCase = container.createCollectionPointUseCase();
  const updateCollectionPointUseCase = container.updateCollectionPointUseCase();
  const deleteCollectionPointUseCase = container.deleteCollectionPointUseCase();
  const assignCarrierToCollectionPointUseCase = container.assignCarrierToCollectionPointUseCase();

  // Usar os hooks individuais com o sistema de DI
  const {
    collectionPoints,
    loading,
    error,
    loadCollectionPoints,
    isFirstLoad,
    filtersRef
  } = useLoadCollectionPoints(getCollectionPointsUseCase, filters);

  const { handleCreate, isCreating: isCreatingInternal } = useCreateCollectionPoint(createCollectionPointUseCase);
  const { handleUpdate, isUpdating: isUpdatingInternal } = useUpdateCollectionPoint(updateCollectionPointUseCase);
  const { handleDelete, isDeleting: isDeletingInternal } = useDeleteCollectionPoint(deleteCollectionPointUseCase);
  const { handleAssignCarrier, isAssigningCarrier: isAssigningCarrierInternal } = useAssignCarrier(assignCarrierToCollectionPointUseCase);

  // Update operation states when individual hooks change
  useEffect(() => {
    setOperationStates({
      isCreating: isCreatingInternal,
      isUpdating: isUpdatingInternal,
      isDeleting: isDeletingInternal,
      isAssigningCarrier: isAssigningCarrierInternal
    });
  }, [isCreatingInternal, isUpdatingInternal, isDeletingInternal, isAssigningCarrierInternal]);

  // Carregar dados iniciais ao montar
  useEffect(() => {
    console.log("useEffect para carregamento inicial disparado", { filters });
    loadCollectionPoints();
    
    return () => {
      console.log("Hook useCollectionPointCasesWithDI desmontando");
      isMountedRef.current = false;
    };
  }, [loadCollectionPoints]);

  // Recarregar quando os filtros mudarem
  useEffect(() => {
    // Evitar carregamento duplo na montagem inicial
    if (!isFirstLoad) {
      console.log("Filtros alterados, recarregando dados", { filters });
      loadCollectionPoints();
    }
  }, [filters, loadCollectionPoints, isFirstLoad]);

  // Operação segura com feedback para o usuário
  const safeOperation = useCallback(async <T,>(
    operation: () => Promise<T>,
    successMessage: string,
    refreshAfter = true
  ): Promise<T | undefined> => {
    try {
      const result = await operation();
      
      if (isMountedRef.current) {
        toast.success(successMessage);
        
        if (refreshAfter) {
          console.log("Operação bem-sucedida, recarregando pontos de coleta");
          await loadCollectionPoints(true);
        }
      }
      
      return result;
    } catch (error) {
      console.error("Operação falhou:", error);
      
      if (isMountedRef.current) {
        toast.error("Ocorreu um erro", {
          description: error instanceof Error ? error.message : "Tente novamente mais tarde"
        });
      }
    }
  }, [loadCollectionPoints]);

  // Operações com feedback e atualização automática
  const handleCreateWithRefresh = useCallback(async (collectionPoint: any) => {
    return safeOperation(
      () => handleCreate(collectionPoint),
      "Ponto de coleta criado com sucesso"
    );
  }, [handleCreate, safeOperation]);

  const handleUpdateWithRefresh = useCallback(async (collectionPoint: any) => {
    return safeOperation(
      () => handleUpdate(collectionPoint),
      "Ponto de coleta atualizado com sucesso"
    );
  }, [handleUpdate, safeOperation]);

  const handleDeleteWithRefresh = useCallback(async (collectionPointId: string) => {
    return safeOperation(
      () => handleDelete(collectionPointId),
      "Ponto de coleta excluído com sucesso"
    );
  }, [handleDelete, safeOperation]);

  const handleAssignCarrierWithRefresh = useCallback(async (collectionPointId: string, carrierId: string | null) => {
    return safeOperation(
      () => handleAssignCarrier(collectionPointId, carrierId),
      carrierId ? "Transportadora associada com sucesso" : "Transportadora desassociada com sucesso"
    );
  }, [handleAssignCarrier, safeOperation]);

  return {
    collectionPoints,
    loading,
    error,
    loadCollectionPoints: useCallback((forceRefresh = false) => loadCollectionPoints(forceRefresh), [loadCollectionPoints]),
    handleCreate: handleCreateWithRefresh,
    handleUpdate: handleUpdateWithRefresh,
    handleDelete: handleDeleteWithRefresh,
    handleAssignCarrier: handleAssignCarrierWithRefresh,
    isCreating: operationStates.isCreating,
    isUpdating: operationStates.isUpdating,
    isDeleting: operationStates.isDeleting,
    isAssigningCarrier: operationStates.isAssigningCarrier
  };
}
