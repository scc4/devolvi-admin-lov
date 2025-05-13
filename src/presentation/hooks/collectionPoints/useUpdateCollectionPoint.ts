
import { useState } from 'react';
import { toast } from "sonner";
import { CollectionPoint as CollectionPointUI } from '../../../types/collection-point';
import { collectionPointAdapter } from '../../../adapters/collectionPoints/collectionPointAdapter';
import { handleCollectionPointError } from './utils';

/**
 * Hook para atualização de pontos de coleta
 */
export function useUpdateCollectionPoint(updateCollectionPointUseCase: any) {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const handleUpdate = async (collectionPoint: Partial<CollectionPointUI>) => {
    setIsUpdating(true);
    try {
      // Converter modelo UI para DTO
      const dto = collectionPointAdapter.fromUIModel(collectionPoint);
      console.log("Updating collection point with DTO:", dto);
      
      const result = await updateCollectionPointUseCase.execute(dto);

      if (result.success && result.collectionPoint) {
        toast.success("Ponto de coleta atualizado com sucesso");
        return collectionPointAdapter.toUIModel(result.collectionPoint);
      } else {
        toast.error("Erro ao atualizar ponto de coleta", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      handleCollectionPointError(error, "Erro ao atualizar ponto de coleta");
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return { handleUpdate, isUpdating };
}
