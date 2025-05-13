
import { CollectionPoint } from "@/types/collection-point";
import { useCollectionPointsQuery } from "./useCollectionPointsQuery";

export function useCollectionPoints(
  establishmentId?: string, 
  carrierId?: string,
  unassigned?: boolean
) {
  console.log("useCollectionPoints hook called with:", { establishmentId, carrierId, unassigned });
  
  const {
    collectionPoints,
    loading,
    error,
    refetch: refreshCollectionPoints,
    createCollectionPoint,
    updateCollectionPoint,
    deleteCollectionPoint,
    assignCarrier: handleAssignCarrier,
    isCreating,
    isUpdating,
    isDeleting,
    isAssigningCarrier
  } = useCollectionPointsQuery({
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
