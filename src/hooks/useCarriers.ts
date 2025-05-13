
import { useCarriersQuery } from "./useCarriersQuery";

export function useCarriers() {
  const {
    carriers,
    loading,
    error,
    refetch,
    handleCreate,
    handleEdit,
    handleDelete,
    handleDeactivate,
    isCreating,
    isUpdating,
    isDeleting
  } = useCarriersQuery();

  return {
    carriers,
    loading,
    error,
    refresh: refetch,
    handleCreate,
    handleEdit,
    handleDelete,
    handleDeactivate,
    isCreating,
    isUpdating,
    isDeleting
  };
}
