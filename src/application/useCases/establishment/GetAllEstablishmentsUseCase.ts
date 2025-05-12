
import { Establishment } from '../../../domain/entities/Establishment';
import { IEstablishmentRepository } from '../../../domain/repositories/IEstablishmentRepository';
import { EstablishmentDTO } from '../../dto/EstablishmentDTO';

/**
 * Use case for fetching all establishments
 */
export class GetAllEstablishmentsUseCase {
  constructor(private establishmentRepository: IEstablishmentRepository) {}

  async execute(): Promise<EstablishmentDTO[]> {
    const establishments = await this.establishmentRepository.getAll();
    
    // Map domain entities to DTOs
    return establishments.map(establishment => ({
      id: establishment.id,
      name: establishment.name,
      type: establishment.type,
      carrierId: establishment.carrierId,
      createdAt: establishment.createdAt.toISOString(),
      updatedAt: establishment.updatedAt.toISOString(),
      collectionPointsCount: establishment.collectionPointsCount || 0
    }));
  }
}
