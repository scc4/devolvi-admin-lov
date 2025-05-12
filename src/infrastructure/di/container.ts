
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { SupabaseUserRepository } from '../repositories/SupabaseUserRepository';
import { GetAllUsersUseCase } from '../../application/useCases/user/GetAllUsersUseCase';
import { DeleteUserUseCase } from '../../application/useCases/user/DeleteUserUseCase';
import { DeactivateUserUseCase } from '../../application/useCases/user/DeactivateUserUseCase';
import { ResetPasswordUseCase } from '../../application/useCases/user/ResetPasswordUseCase';

// Import Carrier related classes
import { ICarrierRepository } from '../../domain/repositories/ICarrierRepository';
import { SupabaseCarrierRepository } from '../repositories/SupabaseCarrierRepository';
import { GetAllCarriersUseCase } from '../../application/useCases/carrier/GetAllCarriersUseCase';
import { CreateCarrierUseCase } from '../../application/useCases/carrier/CreateCarrierUseCase';
import { UpdateCarrierUseCase } from '../../application/useCases/carrier/UpdateCarrierUseCase';
import { DeleteCarrierUseCase } from '../../application/useCases/carrier/DeleteCarrierUseCase';
import { DeactivateCarrierUseCase } from '../../application/useCases/carrier/DeactivateCarrierUseCase';

/**
 * Simple dependency injection container
 */
class Container {
  private instances: Map<string, any> = new Map();

  // User repository
  getUserRepository(): IUserRepository {
    const key = 'userRepository';
    if (!this.instances.has(key)) {
      this.instances.set(key, new SupabaseUserRepository());
    }
    return this.instances.get(key);
  }

  // User use cases
  getAllUsersUseCase(): GetAllUsersUseCase {
    const key = 'getAllUsersUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new GetAllUsersUseCase(this.getUserRepository())
      );
    }
    return this.instances.get(key);
  }

  deleteUserUseCase(): DeleteUserUseCase {
    const key = 'deleteUserUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new DeleteUserUseCase(this.getUserRepository())
      );
    }
    return this.instances.get(key);
  }

  deactivateUserUseCase(): DeactivateUserUseCase {
    const key = 'deactivateUserUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new DeactivateUserUseCase(this.getUserRepository())
      );
    }
    return this.instances.get(key);
  }

  resetPasswordUseCase(): ResetPasswordUseCase {
    const key = 'resetPasswordUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new ResetPasswordUseCase(this.getUserRepository())
      );
    }
    return this.instances.get(key);
  }

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

// Export a singleton instance of the container
export const container = new Container();
