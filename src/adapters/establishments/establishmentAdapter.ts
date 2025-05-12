
import { EstablishmentDTO } from "../../application/dto/EstablishmentDTO";
import type { EstablishmentWithDetails } from "../../types/establishment";

/**
 * Adapter to convert between domain DTO and UI models for establishments
 */
export const establishmentAdapter = {
  /**
   * Convert DTO to UI model
   */
  toUIModel(dto: EstablishmentDTO): EstablishmentWithDetails {
    return {
      id: dto.id,
      name: dto.name,
      type: dto.type,
      carrier_id: dto.carrierId || null,
      created_at: dto.createdAt,
      updated_at: dto.updatedAt,
      collection_points_count: dto.collectionPointsCount || 0,
      carrier: dto.carrier ? {
        id: dto.carrier.id,
        name: dto.carrier.name
      } : null
    };
  },

  /**
   * Convert UI model to DTO
   */
  toDomainDTO(model: EstablishmentWithDetails): EstablishmentDTO {
    return {
      id: model.id,
      name: model.name,
      type: model.type,
      carrierId: model.carrier_id || null,
      createdAt: model.created_at || new Date().toISOString(),
      updatedAt: model.updated_at || new Date().toISOString(),
      collectionPointsCount: model.collection_points_count || 0,
      carrier: model.carrier ? {
        id: model.carrier.id,
        name: model.carrier.name
      } : null
    };
  },

  /**
   * Convert array of DTOs to UI models
   */
  toUIModelList(dtos: EstablishmentDTO[]): EstablishmentWithDetails[] {
    return dtos.map(this.toUIModel);
  }
};
