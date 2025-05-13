
import { ICollectionPointRepository } from '../../../domain/repositories/ICollectionPointRepository';
import { CollectionPointDTO } from '../../dto/CollectionPointDTO';
import { collectionPointAdapter } from '../../../adapters/collectionPoints/collectionPointAdapter';

/**
 * Use case for assigning a carrier to a collection point
 */
export class AssignCarrierToCollectionPointUseCase {
  constructor(private collectionPointRepository: ICollectionPointRepository) {}

  async execute(collectionPointId: string, carrierId: string | null): Promise<{ 
    success: boolean; 
    collectionPoint?: CollectionPointDTO;
    error?: Error;
  }> {
    try {
      // Assign carrier to the collection point
      const updatedCollectionPoint = await this.collectionPointRepository.assignCarrier(collectionPointId, carrierId);
      
      // Convert to DTO and return
      return {
        success: true,
        collectionPoint: collectionPointAdapter.toDTO(updatedCollectionPoint)
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      };
    }
  }
}
