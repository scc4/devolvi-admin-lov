
import { useCarrierCases } from "@/presentation/hooks/useCarrierCases";
import type { Carrier } from "@/types/carrier";
import { CarrierDTO } from "@/application/dto/CarrierDTO";

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
