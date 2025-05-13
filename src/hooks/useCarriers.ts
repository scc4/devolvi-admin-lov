
import { useCarriersWithCollectionPointCounts } from "@/presentation/hooks/carriers/useCarriersWithCollectionPointCounts";
import type { Carrier } from "@/types/carrier";
import { carrierAdapter } from "@/adapters/carriers/carrierAdapter";

export function useCarriers() {
  const {
    carriers,
    loading,
    error,
    loadCarriers,
    handleCreate,
    handleEdit,
    handleDelete,
    handleDeactivate,
    isCreating,
    isUpdating,
    isDeleting
  } = useCarriersWithCollectionPointCounts();

  // Convert the DTO carriers to UI model carriers with collection point counts
  const uiCarriers = carriers.map(carrierDTO => {
    const uiModel = carrierAdapter.toUIModel(carrierDTO);
    // Make sure to include the collection points count
    uiModel.collection_points_count = carrierDTO.collectionPointsCount || 0;
    return uiModel;
  });

  return {
    carriers: uiCarriers,
    loading,
    error,
    refresh: loadCarriers,
    handleCreate,
    handleEdit,
    handleDelete,
    handleDeactivate,
    isCreating,
    isUpdating,
    isDeleting
  };
}
