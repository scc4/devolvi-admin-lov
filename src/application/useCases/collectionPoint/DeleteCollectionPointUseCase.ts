
import { ICollectionPointRepository } from '../../../domain/repositories/ICollectionPointRepository';

/**
 * Use case for deleting a collection point
 */
export class DeleteCollectionPointUseCase {
  constructor(private collectionPointRepository: ICollectionPointRepository) {}

  async execute(collectionPointId: string): Promise<{ success: boolean; error?: Error }> {
    try {
      await this.collectionPointRepository.delete(collectionPointId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error occurred') 
      };
    }
  }
}
