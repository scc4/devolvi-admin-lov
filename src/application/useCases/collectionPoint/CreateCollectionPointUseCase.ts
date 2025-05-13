
import { CollectionPoint } from '../../../domain/entities/CollectionPoint';
import { ICollectionPointRepository } from '../../../domain/repositories/ICollectionPointRepository';
import { CollectionPointDTO } from '../../dto/CollectionPointDTO';
import { collectionPointAdapter } from '../../../adapters/collectionPoints/collectionPointAdapter';

/**
 * Use case for creating a collection point
 */
export class CreateCollectionPointUseCase {
  constructor(private collectionPointRepository: ICollectionPointRepository) {}

  async execute(collectionPointData: Partial<CollectionPointDTO>): Promise<{ 
    success: boolean; 
    collectionPoint?: CollectionPointDTO;
    error?: Error;
  }> {
    try {
      // Convert the DTO to a domain entity
      const collectionPointEntity = collectionPointAdapter.toDomainEntity(collectionPointData);
      
      // Create the collection point in the repository
      const createdCollectionPoint = await this.collectionPointRepository.create(collectionPointEntity);
      
      // Convert back to DTO and return
      return {
        success: true,
        collectionPoint: collectionPointAdapter.toDTO(createdCollectionPoint)
      };
    } catch (error) {
      console.error('Error in CreateCollectionPointUseCase:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      };
    }
  }
}
