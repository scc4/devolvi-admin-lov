
import { Carrier } from '../../../domain/entities/Carrier';
import { ICarrierRepository } from '../../../domain/repositories/ICarrierRepository';
import { CarrierDTO } from '../../dto/CarrierDTO';

interface CreateCarrierInput {
  name: string;
  city: string;
  manager: string;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean;
}

/**
 * Use case for creating a new carrier
 */
export class CreateCarrierUseCase {
  constructor(private carrierRepository: ICarrierRepository) {}

  async execute(input: CreateCarrierInput): Promise<{ success: boolean; carrier?: CarrierDTO; error?: Error }> {
    try {
      const now = new Date();
      
      // Create domain entity
      const carrier = new Carrier({
        id: crypto.randomUUID(), // Generate a new id
        name: input.name,
        city: input.city,
        manager: input.manager,
        phone: input.phone || null,
        email: input.email || null,
        isActive: input.isActive !== undefined ? input.isActive : true,
        createdAt: now,
        updatedAt: now
      });

      // Validate entity
      const validation = carrier.validate();
      if (!validation.isValid) {
        return { 
          success: false, 
          error: new Error(`Validation failed: ${validation.errors.join(', ')}`) 
        };
      }

      // Save to repository
      const savedCarrier = await this.carrierRepository.create(carrier);
      
      // Return DTO
      return {
        success: true,
        carrier: {
          id: savedCarrier.id,
          name: savedCarrier.name,
          city: savedCarrier.city,
          manager: savedCarrier.manager,
          phone: savedCarrier.phone,
          email: savedCarrier.email,
          isActive: savedCarrier.isActive,
          createdAt: savedCarrier.createdAt.toISOString(),
          updatedAt: savedCarrier.updatedAt.toISOString()
        }
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error('Unknown error occurred') 
      };
    }
  }
}
