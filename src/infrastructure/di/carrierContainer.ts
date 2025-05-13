
import { ICarrierRepository } from '../../domain/repositories/ICarrierRepository';
import { SupabaseCarrierRepository } from '../repositories/SupabaseCarrierRepository';
import { GetAllCarriersUseCase } from '../../application/useCases/carrier/GetAllCarriersUseCase';
import { CreateCarrierUseCase } from '../../application/useCases/carrier/CreateCarrierUseCase';
import { UpdateCarrierUseCase } from '../../application/useCases/carrier/UpdateCarrierUseCase';
import { DeleteCarrierUseCase } from '../../application/useCases/carrier/DeleteCarrierUseCase';
import { DeactivateCarrierUseCase } from '../../application/useCases/carrier/DeactivateCarrierUseCase';

/**
 * Carrier module dependency injection container
 */
export class CarrierContainer {
  private instances: Map<string, any> = new Map();

  // Carrier repository
  getCarrierRepository(): ICarrierRepository {
    const key = 'carrierRepository';
    if (!this.instances.has(key)) {
      this.instances.set(key, new SupabaseCarrierRepository());
    }
    return this.instances.get(key);
  }

  // Carrier use cases
  getAllCarriersUseCase(): GetAllCarriersUseCase {
    const key = 'getAllCarriersUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new GetAllCarriersUseCase(this.getCarrierRepository())
      );
    }
    return this.instances.get(key);
  }

  createCarrierUseCase(): CreateCarrierUseCase {
    const key = 'createCarrierUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new CreateCarrierUseCase(this.getCarrierRepository())
      );
    }
    return this.instances.get(key);
  }

  updateCarrierUseCase(): UpdateCarrierUseCase {
    const key = 'updateCarrierUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new UpdateCarrierUseCase(this.getCarrierRepository())
      );
    }
    return this.instances.get(key);
  }

  deleteCarrierUseCase(): DeleteCarrierUseCase {
    const key = 'deleteCarrierUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new DeleteCarrierUseCase(this.getCarrierRepository())
      );
    }
    return this.instances.get(key);
  }

  deactivateCarrierUseCase(): DeactivateCarrierUseCase {
    const key = 'deactivateCarrierUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new DeactivateCarrierUseCase(this.getCarrierRepository())
      );
    }
    return this.instances.get(key);
  }
}

// Create a singleton instance
export const carrierContainer = new CarrierContainer();
