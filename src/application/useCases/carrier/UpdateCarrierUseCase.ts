
import { ICarrierRepository } from '../../../domain/repositories/ICarrierRepository';
import { CarrierDTO } from '../../dto/CarrierDTO';

interface UpdateCarrierInput {
  id: string;
  name?: string;
  city?: string;
  manager?: string;
  phone?: string | null;
  email?: string | null;
  isActive?: boolean;
}

/**
 * Use case for updating a carrier
 */
export class UpdateCarrierUseCase {
  constructor(private carrierRepository: ICarrierRepository) {}

  async execute(input: UpdateCarrierInput): Promise<{ success: boolean; carrier?: CarrierDTO; error?: Error }> {
    try {
      // Find existing carrier
      const existingCarrier = await this.carrierRepository.getById(input.id);
      if (!existingCarrier) {
        return { 
          success: false, 
          error: new Error(`Carrier with ID ${input.id} not found`) 
        };
      }

      // Update domain entity
      existingCarrier.update({
        name: input.name,
        city: input.city,
        manager: input.manager,
        phone: input.phone,
        email: input.email
      });

      // Handle isActive separately if provided
      if (input.isActive !== undefined && input.isActive !== existingCarrier.isActive) {
        if (input.isActive) {
          existingCarrier.activate();
        } else {
          existingCarrier.deactivate();
        }
      }

      // Validate updated entity
      const validation = existingCarrier.validate();
      if (!validation.isValid) {
        return { 
          success: false, 
          error: new Error(`Validation failed: ${validation.errors.join(', ')}`) 
        };
      }

      // Save to repository
      const updatedCarrier = await this.carrierRepository.update(existingCarrier);
      
      // Return DTO
      return {
        success: true,
        carrier: {
          id: updatedCarrier.id,
          name: updatedCarrier.name,
          city: updatedCarrier.city,
          manager: updatedCarrier.manager,
          phone: updatedCarrier.phone,
          email: updatedCarrier.email,
          isActive: updatedCarrier.isActive,
          createdAt: updatedCarrier.createdAt.toISOString(),
          updatedAt: updatedCarrier.updatedAt.toISOString()
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
