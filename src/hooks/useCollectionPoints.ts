
import { CollectionPoint } from "@/types/collection-point";
import { useCollectionPointCases } from "@/presentation/hooks/useCollectionPointCases";

export function useCollectionPoints(
  establishmentId?: string, 
  carrierId?: string,
  unassigned?: boolean
) {
  console.log("useCollectionPoints hook called with:", { establishmentId, carrierId, unassigned });
  
  // Use the DDD implementation with DI
  const {
    collectionPoints,
    loading,
    error,
    loadCollectionPoints: refreshCollectionPoints,
    handleCreate: createCollectionPoint,
    handleUpdate: updateCollectionPoint,
    handleDelete: deleteCollectionPoint,
    handleAssignCarrier,
    isCreating,
    isUpdating,
    isDeleting,
    isAssigningCarrier
  } = useCollectionPointCases({
    establishmentId,
    carrierId,
    unassigned
  });

  // For backward compatibility
  const refetch = refreshCollectionPoints;
  const isLoading = loading;

  return {
    collectionPoints,
    loading,
    error,
    refreshCollectionPoints,
    createCollectionPoint,
    updateCollectionPoint,
    deleteCollectionPoint,
    handleAssignCarrier,
    isCreating,
    isUpdating,
    isDeleting,
    isAssigningCarrier,
    refetch,
    isLoading
  };
}
