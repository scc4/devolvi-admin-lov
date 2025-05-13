
import { useEstablishmentsQuery } from "./useEstablishmentsQuery";

export function useEstablishments() {
  const {
    establishments,
    loading,
    error,
    refetchEstablishments,
    createEstablishment,
    updateEstablishment,
    deleteEstablishment,
    isCreating,
    isUpdating,
    isDeleting
  } = useEstablishmentsQuery();

  return {
    establishments,
    loading,
    error,
    loadEstablishments: refetchEstablishments,
    handleCreate: createEstablishment,
    handleEdit: updateEstablishment,
    handleDelete: deleteEstablishment,
    isCreating,
    isUpdating,
    isDeleting
  };
}
