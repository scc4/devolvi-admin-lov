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
 * usando injeção de dependência
 */
export function useCollectionPointCasesWithDI(filters?: {
  establishmentId?: string;
  carrierId?: string;
  unassigned?: boolean;
  cityFilter?: string;
}) {
  // Keep track of component mount status
  const isMountedRef = useRef(true);
  const initStartedRef = useRef(false);
  const [isCacheFresh, setIsCacheFresh] = useState(false);
  
  // Track operation states independently
  const [operationStates, setOperationStates] = useState({
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isAssigningCarrier: false
  });
  
  // Cache for storing results
  const cacheRef = useRef<{
    filters: typeof filters | null;
    collectionPoints: any[] | null;
    timestamp: number | null;
  }>({
    filters: null,
    collectionPoints: null,
    timestamp: null
  });
  
  // Obter casos de uso do container
  const getCollectionPointsUseCase = container.getCollectionPointsUseCase();
  const createCollectionPointUseCase = container.createCollectionPointUseCase();
  const updateCollectionPointUseCase = container.updateCollectionPointUseCase();
  const deleteCollectionPointUseCase = container.deleteCollectionPointUseCase();
  const assignCarrierToCollectionPointUseCase = container.assignCarrierToCollectionPointUseCase();

  // Usar os hooks individuais
  const {
    collectionPoints,
    loading,
    hasError,
    errorMessage,
    loadCollectionPoints,
    isFirstLoad,
    filtersRef,
    abortControllerRef
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

  // Check if filters have changed
  useEffect(() => {
    if (!initStartedRef.current) {
      initStartedRef.current = true;
      return;
    }
    
    const filtersChanged = JSON.stringify(filtersRef.current) !== JSON.stringify(filters);
    
    if (filtersChanged) {
      console.log("Filters changed, updating filtersRef", {
        old: filtersRef.current,
        new: filters
      });
      filtersRef.current = filters;
      
      // Check cache for these filters
      const cacheMatches = 
        cacheRef.current.filters && 
        JSON.stringify(cacheRef.current.filters) === JSON.stringify(filters) &&
        cacheRef.current.timestamp && 
        Date.now() - cacheRef.current.timestamp < 30000; // 30 second cache
      
      if (cacheMatches && cacheRef.current.collectionPoints) {
        console.log("Using cached collection points data");
        setIsCacheFresh(true);
      } else {
        setIsCacheFresh(false);
        loadCollectionPoints();
      }
    }
  }, [filters, loadCollectionPoints]);

  // Initial data loading - once only
  useEffect(() => {
    console.log("useEffect for initial data loading triggered");
    
    if (isFirstLoad.current) {
      console.log("First load, fetching collection points");
      loadCollectionPoints();
    }
    
    // Cleanup on unmount
    return () => {
      console.log("Collection points component unmounting, cleaning up");
      isMountedRef.current = false;
      
      if (abortControllerRef.current) {
        console.log("Aborting pending collection points requests");
        abortControllerRef.current.abort();
      }
    };
  }, [loadCollectionPoints]);

  // Cache the results when collectionPoints change
  useEffect(() => {
    if (collectionPoints.length > 0 && !loading) {
      cacheRef.current = {
        filters,
        collectionPoints,
        timestamp: Date.now()
      };
    }
  }, [collectionPoints, loading, filters]);

  // Refresh function with cache control
  const refreshCollectionPoints = useCallback(async (ignoreCache = false) => {
    if (ignoreCache) {
      setIsCacheFresh(false);
    }
    await loadCollectionPoints(ignoreCache);
  }, [loadCollectionPoints]);

  // Safely perform operations with automatic refresh
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
          console.log("Operation successful, refreshing collection points data");
          await refreshCollectionPoints(true);
        }
      }
      
      return result;
    } catch (error) {
      console.error("Operation failed:", error);
      
      if (isMountedRef.current) {
        toast.error("Ocorreu um erro", {
          description: error instanceof Error ? error.message : "Tente novamente mais tarde"
        });
      }
    }
  }, [refreshCollectionPoints]);

  // Wrap operations with safe execution
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
    error: hasError ? errorMessage : null,
    loadCollectionPoints: refreshCollectionPoints,
    handleCreate: handleCreateWithRefresh,
    handleUpdate: handleUpdateWithRefresh,
    handleDelete: handleDeleteWithRefresh,
    handleAssignCarrier: handleAssignCarrierWithRefresh,
    isCreating: operationStates.isCreating,
    isUpdating: operationStates.isUpdating,
    isDeleting: operationStates.isDeleting,
    isAssigningCarrier: operationStates.isAssigningCarrier,
    isCacheFresh
  };
}
