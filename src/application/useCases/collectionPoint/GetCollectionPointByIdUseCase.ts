
import { ICollectionPointRepository } from '../../../domain/repositories/ICollectionPointRepository';
import { CollectionPointDTO } from '../../dto/CollectionPointDTO';
import { collectionPointAdapter } from '../../../adapters/collectionPoints/collectionPointAdapter';

/**
 * Use case for getting a collection point by ID
 */
export class GetCollectionPointByIdUseCase {
  constructor(private collectionPointRepository: ICollectionPointRepository) {}

  async execute(id: string): Promise<CollectionPointDTO | null> {
    try {
      const collectionPoint = await this.collectionPointRepository.getById(id);
      
      if (!collectionPoint) {
        return null;
      }
      
      return collectionPointAdapter.toDTO(collectionPoint);
    } catch (error) {
      console.error('Error in GetCollectionPointByIdUseCase:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }
}
