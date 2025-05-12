
/**
 * User entity representing a user in the system
 */
export class User {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;

  constructor(params: {
    id: string;
    email: string | null;
    name: string | null;
    phone: string | null;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
  }) {
    this.id = params.id;
    this.email = params.email;
    this.name = params.name;
    this.phone = params.phone;
    this.role = params.role;
    this.status = params.status;
    this.createdAt = params.createdAt;
  }

  // Domain methods - business logic specific to User entity
  isActive(): boolean {
    return this.status === 'Ativo';
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isOwner(): boolean {
    return this.role === 'owner';
  }

  canManageUsers(): boolean {
    return this.isAdmin() || this.isOwner();
  }

  // Validation methods
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.email && !this.name) {
      errors.push("User must have either an email or name");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export type UserRole = 'owner' | 'admin' | 'carrier' | 'dropoff' | 'user';
export type UserStatus = 'Ativo' | 'Inativo' | 'Convidado';
