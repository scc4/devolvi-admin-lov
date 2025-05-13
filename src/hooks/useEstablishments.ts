
import { useEstablishmentCases } from "@/presentation/hooks/useEstablishmentCases";
import type { EstablishmentWithDetails } from "@/types/establishment";

export function useEstablishments() {
  const {
    establishments,
    loading,
    error,
    loadEstablishments,
    handleCreate,
    handleEdit,
    handleDelete,
    isCreating,
    isUpdating,
    isDeleting
  } = useEstablishmentCases();

  return {
    establishments,
    loading,
    error,
    loadEstablishments,
    handleEdit,
    handleDelete,
    handleCreate
  };
}
