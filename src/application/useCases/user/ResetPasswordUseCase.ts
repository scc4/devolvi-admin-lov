
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

/**
 * Use case for resetting a user's password
 */
export class ResetPasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, password: string): Promise<{ success: boolean; error?: Error }> {
    try {
      // Basic validation
      if (password.length < 6) {
        return {
          success: false,
          error: new Error('A senha deve ter pelo menos 6 caracteres')
        };
      }

      await this.userRepository.resetPassword(userId, password);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error occurred') 
      };
    }
  }
}
