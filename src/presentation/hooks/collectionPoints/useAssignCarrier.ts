
import { useState } from 'react';
import { toast } from "sonner";
import { handleCollectionPointError } from './utils';

/**
 * Hook para associação de transportadoras a pontos de coleta
 */
export function useAssignCarrier(assignCarrierToCollectionPointUseCase: any) {
  const [isAssigningCarrier, setIsAssigningCarrier] = useState<boolean>(false);

  const handleAssignCarrier = async (collectionPointId: string, carrierId: string | null) => {
    setIsAssigningCarrier(true);
    try {
      console.log("Assigning carrier to collection point:", { collectionPointId, carrierId });
      // Passar parâmetros como um único objeto
      const result = await assignCarrierToCollectionPointUseCase.execute({
        collectionPointId,
        carrierId
      });
      
      if (result.success) {
        toast.success(carrierId 
          ? "Transportadora associada com sucesso" 
          : "Transportadora desassociada com sucesso"
        );
      } else {
        toast.error(carrierId 
          ? "Erro ao associar transportadora" 
          : "Erro ao desassociar transportadora", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      handleCollectionPointError(error, carrierId 
        ? "Erro ao associar transportadora" 
        : "Erro ao desassociar transportadora"
      );
      throw error;
    } finally {
      setIsAssigningCarrier(false);
    }
  };

  return { handleAssignCarrier, isAssigningCarrier };
}
