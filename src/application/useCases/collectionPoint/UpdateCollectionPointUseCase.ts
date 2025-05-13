
import { ICollectionPointRepository } from '../../../domain/repositories/ICollectionPointRepository';
import { CollectionPointDTO } from '../../dto/CollectionPointDTO';
import { collectionPointAdapter } from '../../../adapters/collectionPoints/collectionPointAdapter';

/**
 * Use case for updating a collection point
 */
export class UpdateCollectionPointUseCase {
  constructor(private collectionPointRepository: ICollectionPointRepository) {}

  async execute(collectionPointData: Partial<CollectionPointDTO>): Promise<{ 
    success: boolean; 
    collectionPoint?: CollectionPointDTO;
    error?: Error;
  }> {
    try {
      // Check if ID is provided
      if (!collectionPointData.id) {
        return {
          success: false,
          error: new Error('Collection point ID is required')
        };
      }

      // Convert the DTO to a domain entity
      const collectionPointEntity = collectionPointAdapter.toDomainEntity(collectionPointData);
      
      // Update the collection point in the repository
      const updatedCollectionPoint = await this.collectionPointRepository.update(collectionPointEntity);
      
      // Convert back to DTO and return
      return {
        success: true,
        collectionPoint: collectionPointAdapter.toDTO(updatedCollectionPoint)
      };
    } catch (error) {
      console.error('Error in UpdateCollectionPointUseCase:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      };
    }
  }
}
