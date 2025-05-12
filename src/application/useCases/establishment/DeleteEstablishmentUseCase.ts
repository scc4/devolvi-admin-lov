
import { IEstablishmentRepository } from '../../../domain/repositories/IEstablishmentRepository';

/**
 * Use case for deleting an establishment
 */
export class DeleteEstablishmentUseCase {
  constructor(private establishmentRepository: IEstablishmentRepository) {}

  async execute(establishmentId: string): Promise<{ success: boolean; error?: Error }> {
    try {
      await this.establishmentRepository.delete(establishmentId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error occurred') 
      };
    }
  }
}
