
import { ICarrierRepository } from '../../../domain/repositories/ICarrierRepository';

/**
 * Use case for deactivating a carrier
 */
export class DeactivateCarrierUseCase {
  constructor(private carrierRepository: ICarrierRepository) {}

  async execute(carrierId: string): Promise<{ success: boolean; error?: Error }> {
    try {
      await this.carrierRepository.deactivate(carrierId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error occurred') 
      };
    }
  }
}
