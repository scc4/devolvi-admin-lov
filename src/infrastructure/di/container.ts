
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { SupabaseUserRepository } from '../repositories/SupabaseUserRepository';
import { GetAllUsersUseCase } from '../../application/useCases/user/GetAllUsersUseCase';
import { DeleteUserUseCase } from '../../application/useCases/user/DeleteUserUseCase';
import { DeactivateUserUseCase } from '../../application/useCases/user/DeactivateUserUseCase';
import { ResetPasswordUseCase } from '../../application/useCases/user/ResetPasswordUseCase';

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
}

// Export a singleton instance of the container
export const container = new Container();
