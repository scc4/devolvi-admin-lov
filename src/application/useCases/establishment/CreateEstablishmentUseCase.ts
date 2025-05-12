
import { IEstablishmentRepository } from '../../../domain/repositories/IEstablishmentRepository';
import { EstablishmentDTO } from '../../dto/EstablishmentDTO';

/**
 * Use case for creating an establishment
 */
export class CreateEstablishmentUseCase {
  constructor(private establishmentRepository: IEstablishmentRepository) {}

  async execute(data: {
    name: string;
    type: 'public' | 'private';
    carrierId?: string | null;
  }): Promise<{ success: boolean; establishment?: EstablishmentDTO; error?: Error }> {
    try {
      const establishment = await this.establishmentRepository.create({
        name: data.name,
        type: data.type,
        carrierId: data.carrierId || null
      });

      return {
        success: true,
        establishment: {
          id: establishment.id,
          name: establishment.name,
          type: establishment.type,
          carrierId: establishment.carrierId,
          createdAt: establishment.createdAt.toISOString(),
          updatedAt: establishment.updatedAt.toISOString(),
          collectionPointsCount: 0
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error occurred') 
      };
    }
  }
}
