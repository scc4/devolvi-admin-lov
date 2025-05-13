
import { IEstablishmentRepository } from '../../domain/repositories/IEstablishmentRepository';
import { SupabaseEstablishmentRepository } from '../repositories/SupabaseEstablishmentRepository';
import { GetAllEstablishmentsUseCase } from '../../application/useCases/establishment/GetAllEstablishmentsUseCase';
import { CreateEstablishmentUseCase } from '../../application/useCases/establishment/CreateEstablishmentUseCase';
import { UpdateEstablishmentUseCase } from '../../application/useCases/establishment/UpdateEstablishmentUseCase';
import { DeleteEstablishmentUseCase } from '../../application/useCases/establishment/DeleteEstablishmentUseCase';

/**
 * Establishment module dependency injection container
 */
export class EstablishmentContainer {
  private instances: Map<string, any> = new Map();

  // Establishment repository
  getEstablishmentRepository(): IEstablishmentRepository {
    const key = 'establishmentRepository';
    if (!this.instances.has(key)) {
      this.instances.set(key, new SupabaseEstablishmentRepository());
    }
    return this.instances.get(key);
  }

  // Establishment use cases
  getAllEstablishmentsUseCase(): GetAllEstablishmentsUseCase {
    const key = 'getAllEstablishmentsUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new GetAllEstablishmentsUseCase(this.getEstablishmentRepository())
      );
    }
    return this.instances.get(key);
  }

  createEstablishmentUseCase(): CreateEstablishmentUseCase {
    const key = 'createEstablishmentUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new CreateEstablishmentUseCase(this.getEstablishmentRepository())
      );
    }
    return this.instances.get(key);
  }

  updateEstablishmentUseCase(): UpdateEstablishmentUseCase {
    const key = 'updateEstablishmentUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new UpdateEstablishmentUseCase(this.getEstablishmentRepository())
      );
    }
    return this.instances.get(key);
  }

  deleteEstablishmentUseCase(): DeleteEstablishmentUseCase {
    const key = 'deleteEstablishmentUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new DeleteEstablishmentUseCase(this.getEstablishmentRepository())
      );
    }
    return this.instances.get(key);
  }
}

// Create a singleton instance
export const establishmentContainer = new EstablishmentContainer();
