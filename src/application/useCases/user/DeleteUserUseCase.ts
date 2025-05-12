
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

/**
 * Use case for deleting a user
 */
export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<{ success: boolean; error?: Error }> {
    try {
      await this.userRepository.delete(userId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error occurred') 
      };
    }
  }
}
