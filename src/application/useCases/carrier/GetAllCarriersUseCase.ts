
import { Carrier } from '../../../domain/entities/Carrier';
import { ICarrierRepository } from '../../../domain/repositories/ICarrierRepository';
import { CarrierDTO } from '../../dto/CarrierDTO';

/**
 * Use case for fetching all carriers
 */
export class GetAllCarriersUseCase {
  constructor(private carrierRepository: ICarrierRepository) {}

  async execute(): Promise<CarrierDTO[]> {
    const carriers = await this.carrierRepository.getAll();
    
    // Map domain entities to DTOs
    return carriers.map(carrier => ({
      id: carrier.id,
      name: carrier.name,
      city: carrier.city,
      manager: carrier.manager,
      phone: carrier.phone,
      email: carrier.email,
      isActive: carrier.isActive,
      createdAt: carrier.createdAt.toISOString(),
      updatedAt: carrier.updatedAt.toISOString()
    }));
  }
}
