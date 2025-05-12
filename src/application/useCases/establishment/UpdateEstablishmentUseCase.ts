
import { IEstablishmentRepository } from '../../../domain/repositories/IEstablishmentRepository';
import { EstablishmentDTO } from '../../dto/EstablishmentDTO';

/**
 * Use case for updating an establishment
 */
export class UpdateEstablishmentUseCase {
  constructor(private establishmentRepository: IEstablishmentRepository) {}

  async execute(data: {
    id: string;
    name?: string;
    type?: 'public' | 'private';
    carrierId?: string | null;
  }): Promise<{ success: boolean; establishment?: EstablishmentDTO; error?: Error }> {
    try {
      const establishment = await this.establishmentRepository.update({
        id: data.id,
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type }),
        ...(data.carrierId !== undefined && { carrierId: data.carrierId })
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
          collectionPointsCount: establishment.collectionPointsCount || 0
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
