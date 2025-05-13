
import { useState } from 'react';
import { toast } from "sonner";
import { CollectionPoint as CollectionPointUI } from '../../../types/collection-point';
import { collectionPointAdapter } from '../../../adapters/collectionPoints/collectionPointAdapter';
import { handleCollectionPointError } from './utils';

/**
 * Hook para criação de pontos de coleta
 */
export function useCreateCollectionPoint(createCollectionPointUseCase: any) {
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleCreate = async (collectionPoint: Partial<CollectionPointUI>) => {
    setIsCreating(true);
    try {
      // Converter modelo UI para DTO
      const dto = collectionPointAdapter.fromUIModel(collectionPoint);
      console.log("Creating collection point with DTO:", dto);
      
      const result = await createCollectionPointUseCase.execute(dto);

      if (result.success && result.collectionPoint) {
        toast.success("Ponto de coleta cadastrado com sucesso");
        return collectionPointAdapter.toUIModel(result.collectionPoint);
      } else {
        toast.error("Erro ao cadastrar ponto de coleta", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      handleCollectionPointError(error, "Erro ao cadastrar ponto de coleta");
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { handleCreate, isCreating };
}
