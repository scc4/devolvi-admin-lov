
import { useEffect } from 'react';
import { container } from '../../../infrastructure/di/container';
import { useLoadCollectionPoints } from './useLoadCollectionPoints';
import { useCreateCollectionPoint } from './useCreateCollectionPoint';
import { useUpdateCollectionPoint } from './useUpdateCollectionPoint';
import { useDeleteCollectionPoint } from './useDeleteCollectionPoint';
import { useAssignCarrier } from './useAssignCarrier';

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
    error,
    loadCollectionPoints,
    isFirstLoad,
    filtersRef,
    abortControllerRef
  } = useLoadCollectionPoints(getCollectionPointsUseCase, filters);

  const { handleCreate, isCreating } = useCreateCollectionPoint(createCollectionPointUseCase);
  const { handleUpdate, isUpdating } = useUpdateCollectionPoint(updateCollectionPointUseCase);
  const { handleDelete, isDeleting } = useDeleteCollectionPoint(deleteCollectionPointUseCase);
  const { handleAssignCarrier, isAssigningCarrier } = useAssignCarrier(assignCarrierToCollectionPointUseCase);

  // Atualizar filtersRef quando filtros mudam
  useEffect(() => {
    if (JSON.stringify(filtersRef.current) !== JSON.stringify(filters)) {
      filtersRef.current = filters;
      // Se filtros mudarem e não for o primeiro carregamento, disparar carregamento
      if (!isFirstLoad.current) {
        loadCollectionPoints();
      }
    }
  }, [filters, loadCollectionPoints]);

  // Carregar pontos de coleta no primeiro render usando useEffect
  useEffect(() => {
    console.log("useEffect triggered, checking if we should load collection points");
    if (isFirstLoad.current) {
      console.log("First load, fetching collection points");
      isFirstLoad.current = false;
      loadCollectionPoints();
    }
    
    // Função para limpar requisições pendentes quando componente desmonta
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadCollectionPoints]);

  // Criar função wrapper para recarregar após operações CRUD
  const handleCreateWithRefresh = async (collectionPoint: any) => {
    const result = await handleCreate(collectionPoint);
    await loadCollectionPoints();
    return result;
  };

  const handleUpdateWithRefresh = async (collectionPoint: any) => {
    const result = await handleUpdate(collectionPoint);
    await loadCollectionPoints();
    return result;
  };

  const handleDeleteWithRefresh = async (collectionPointId: string) => {
    await handleDelete(collectionPointId);
    await loadCollectionPoints();
  };

  const handleAssignCarrierWithRefresh = async (collectionPointId: string, carrierId: string | null) => {
    await handleAssignCarrier(collectionPointId, carrierId);
    await loadCollectionPoints();
  };

  return {
    collectionPoints,
    loading,
    error,
    loadCollectionPoints,
    handleCreate: handleCreateWithRefresh,
    handleUpdate: handleUpdateWithRefresh,
    handleDelete: handleDeleteWithRefresh,
    handleAssignCarrier: handleAssignCarrierWithRefresh,
    isCreating,
    isUpdating,
    isDeleting,
    isAssigningCarrier
  };
}
