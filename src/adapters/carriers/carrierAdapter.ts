
import { CarrierDTO } from "../../application/dto/CarrierDTO";
import type { Carrier as CarrierUI } from "../../types/carrier";

/**
 * Adapter to convert between domain DTO and UI models for carriers
 */
export const carrierAdapter = {
  /**
   * Convert DTO to UI model
   */
  toUIModel(dto: CarrierDTO): CarrierUI {
    return {
      id: dto.id,
      name: dto.name,
      city: dto.city,
      manager: dto.manager,
      phone: dto.phone || '',
      email: dto.email || '',
      is_active: dto.isActive,
      collection_points_count: dto.collectionPointsCount || 0
    };
  },

  /**
   * Convert UI model to DTO
   */
  toDomainDTO(model: CarrierUI): CarrierDTO {
    return {
      id: model.id,
      name: model.name,
      city: model.city,
      manager: model.manager,
      phone: model.phone || null,
      email: model.email || null,
      isActive: model.is_active,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      collectionPointsCount: model.collection_points_count
    };
  },

  /**
   * Convert array of DTOs to UI models
   */
  toUIModelList(dtos: CarrierDTO[]): CarrierUI[] {
    return dtos.map(this.toUIModel);
  }
};
