
import { useCollectionPointsQuery } from '@/hooks/useCollectionPointsQuery';

/**
 * Hook principal que expõe casos de uso relacionados a pontos de coleta
 * usando injeção de dependência - Versão refatorada para usar React Query
 */
export function useCollectionPointCasesWithDI(filters?: {
  establishmentId?: string;
  carrierId?: string;
  unassigned?: boolean;
  cityFilter?: string;
}) {
  // Usar diretamente o hook baseado em React Query
  const {
    collectionPoints,
    loading,
    error,
    refetch,
    createCollectionPoint: handleCreate,
    updateCollectionPoint: handleUpdate,
    deleteCollectionPoint: handleDelete,
    assignCarrier: handleAssignCarrier,
    isCreating,
    isUpdating,
    isDeleting,
    isAssigningCarrier
  } = useCollectionPointsQuery(filters);

  return {
    collectionPoints,
    loading,
    error,
    loadCollectionPoints: refetch, // Manter compatibilidade com nome antigo
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
