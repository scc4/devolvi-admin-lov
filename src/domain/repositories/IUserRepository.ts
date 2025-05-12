
import { User } from '../entities/User';

/**
 * Interface defining the contract for User repository implementations
 */
export interface IUserRepository {
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  deactivate(id: string): Promise<void>;
  resetPassword(id: string, password: string): Promise<void>;
}
