
import { UserRole, UserStatus } from '../../domain/entities/User';

/**
 * Data Transfer Object for User entity
 */
export interface UserDTO {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}
