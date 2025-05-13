
import { useCarrierCases } from "@/presentation/hooks/useCarrierCases";
import { Carrier } from "@/types/carrier";

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
  } = useCarrierCases();

  return {
    carriers,
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
