
import { useState } from 'react';
import { toast } from "sonner";
import { handleCollectionPointError } from './utils';

/**
 * Hook para exclusão de pontos de coleta
 */
export function useDeleteCollectionPoint(deleteCollectionPointUseCase: any) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async (collectionPointId: string) => {
    setIsDeleting(true);
    try {
      console.log("Deleting collection point with ID:", collectionPointId);
      const result = await deleteCollectionPointUseCase.execute(collectionPointId);
      
      if (result.success) {
        toast.success("Ponto de coleta excluído com sucesso");
      } else {
        toast.error("Erro ao excluir ponto de coleta", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      handleCollectionPointError(error, "Erro ao excluir ponto de coleta");
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return { handleDelete, isDeleting };
}
