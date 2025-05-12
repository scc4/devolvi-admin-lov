
/**
 * Carrier entity representing a transportation company in the system
 */
export class Carrier {
  id: string;
  name: string;
  city: string;
  manager: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id: string;
    name: string;
    city: string;
    manager: string;
    phone: string | null;
    email: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.city = params.city;
    this.manager = params.manager;
    this.phone = params.phone;
    this.email = params.email;
    this.isActive = params.isActive;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }

  // Domain methods
  deactivate(): void {
    this.isActive = false;
  }

  activate(): void {
    this.isActive = true;
  }

  update(params: {
    name?: string;
    city?: string;
    manager?: string;
    phone?: string | null;
    email?: string | null;
  }): void {
    if (params.name) this.name = params.name;
    if (params.city) this.city = params.city;
    if (params.manager) this.manager = params.manager;
    if (params.phone !== undefined) this.phone = params.phone;
    if (params.email !== undefined) this.email = params.email;
    this.updatedAt = new Date();
  }

  // Validation methods
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.name) {
      errors.push("Carrier name is required");
    }

    if (!this.city) {
      errors.push("City is required");
    }

    if (!this.manager) {
      errors.push("Manager name is required");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
