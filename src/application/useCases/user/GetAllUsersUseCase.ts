
import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserDTO } from '../../dto/UserDTO';

/**
 * Use case for fetching all users
 */
export class GetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<UserDTO[]> {
    const users = await this.userRepository.getAll();
    
    // Map domain entities to DTOs
    return users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString()
    }));
  }
}
