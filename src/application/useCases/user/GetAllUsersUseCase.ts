
import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserDTO } from '../../dto/UserDTO';

/**
 * Use case for fetching all users
 */
export class GetAllUsersUseCase {
  private cachedUsers: UserDTO[] | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_TTL_MS = 60000; // 1 minuto de cache
  
  constructor(private userRepository: IUserRepository) {}

  async execute(forceRefresh = false): Promise<UserDTO[]> {
    const now = Date.now();
    const isCacheValid = this.cachedUsers && 
                         !forceRefresh && 
                         (now - this.lastFetchTime) < this.CACHE_TTL_MS;
    
    // Usar cache se disponível e válido
    if (isCacheValid) {
      console.log("Using cached users data");
      return this.cachedUsers;
    }
    
    // Buscar novos dados
    console.log("Fetching fresh users data");
    const users = await this.userRepository.getAll();
    
    // Map domain entities to DTOs e atualizar cache
    const dtos = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString()
    }));
    
    this.cachedUsers = dtos;
    this.lastFetchTime = Date.now();
    
    return dtos;
  }
}
