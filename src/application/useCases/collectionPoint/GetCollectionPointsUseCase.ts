
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
      console.log("GetCollectionPointsUseCase.execute called with filters:", filters);
      let collectionPoints: CollectionPoint[];

      if (filters?.unassigned) {
        console.log("Fetching unassigned collection points");
        collectionPoints = await this.collectionPointRepository.getUnassigned(filters.cityFilter);
      } else if (filters?.establishmentId) {
        console.log(`Fetching collection points for establishment: ${filters.establishmentId}`);
        collectionPoints = await this.collectionPointRepository.getByEstablishment(filters.establishmentId);
      } else if (filters?.carrierId) {
        console.log(`Fetching collection points for carrier: ${filters.carrierId}`);
        collectionPoints = await this.collectionPointRepository.getByCarrier(filters.carrierId);
      } else {
        console.log("Fetching all collection points");
        collectionPoints = await this.collectionPointRepository.getAll();
      }

      console.log("Retrieved collection points:", collectionPoints);

      // Convert domain entities to DTOs
      const dtos = collectionPoints.map(cp => collectionPointAdapter.toDTO(cp));
      console.log("Converted to DTOs:", dtos);
      
      return dtos;
    } catch (error) {
      console.error('Error in GetCollectionPointsUseCase:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }
}
