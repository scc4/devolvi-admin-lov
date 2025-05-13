
import { CollectionPoint } from '../../../domain/entities/CollectionPoint';
import { ICollectionPointRepository } from '../../../domain/repositories/ICollectionPointRepository';
import { CollectionPointDTO } from '../../dto/CollectionPointDTO';
import { collectionPointAdapter } from '../../../adapters/collectionPoints/collectionPointAdapter';

/**
 * Use case for getting all collection points with filtering options
 */
export class GetCollectionPointsUseCase {
  constructor(private collectionPointRepository: ICollectionPointRepository) {}

  /**
   * Get all collection points with optional filters
   */
  async execute(filters?: {
    establishmentId?: string;
    carrierId?: string;
    unassigned?: boolean;
    cityFilter?: string;
  }): Promise<CollectionPointDTO[]> {
    try {
      let collectionPoints: CollectionPoint[];

      if (filters?.unassigned) {
        collectionPoints = await this.collectionPointRepository.getUnassigned(filters.cityFilter);
      } else if (filters?.establishmentId) {
        collectionPoints = await this.collectionPointRepository.getByEstablishment(filters.establishmentId);
      } else if (filters?.carrierId) {
        collectionPoints = await this.collectionPointRepository.getByCarrier(filters.carrierId);
      } else {
        collectionPoints = await this.collectionPointRepository.getAll();
      }

      // Convert domain entities to DTOs
      return collectionPoints.map(cp => collectionPointAdapter.toDTO(cp));
    } catch (error) {
      console.error('Error in GetCollectionPointsUseCase:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }
}
