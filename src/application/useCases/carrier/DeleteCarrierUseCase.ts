
import { ICarrierRepository } from '../../../domain/repositories/ICarrierRepository';

/**
 * Use case for deleting a carrier
 */
export class DeleteCarrierUseCase {
  constructor(private carrierRepository: ICarrierRepository) {}

  async execute(carrierId: string): Promise<{ success: boolean; error?: Error }> {
    try {
      await this.carrierRepository.delete(carrierId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error occurred') 
      };
    }
  }
}
