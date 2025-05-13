
import { CollectionPoint } from '../../domain/entities/CollectionPoint';
import { CollectionPointDTO } from '../../application/dto/CollectionPointDTO';
import { CollectionPoint as CollectionPointUI } from '../../types/collection-point';

/**
 * Adapter to convert between domain entities, DTOs and UI models
 */
export const collectionPointAdapter = {
  /**
   * Convert domain entity to DTO
   */
  toDTO(entity: CollectionPoint): CollectionPointDTO {
    return {
      id: entity.id,
      name: entity.name,
      address: entity.address,
      establishmentId: entity.establishmentId,
      establishment: entity.establishmentId ? {
        name: entity.establishmentName || ''
      } : null,
      carrierId: entity.carrierId,
      carrier: entity.carrierId ? {
        name: entity.carrierName || ''
      } : null,
      phone: entity.phone,
      street: entity.street,
      number: entity.number,
      complement: entity.complement,
      district: entity.district,
      zipCode: entity.zipCode,
      city: entity.city,
      state: entity.state,
      latitude: entity.latitude,
      longitude: entity.longitude,
      isActive: entity.isActive,
      operatingHours: entity.operatingHours,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  },

  /**
   * Convert DTO to domain entity
   */
  toDomainEntity(dto: Partial<CollectionPointDTO>): Partial<CollectionPoint> {
    return {
      id: dto.id,
      name: dto.name,
      address: dto.address,
      establishmentId: dto.establishmentId !== undefined ? dto.establishmentId : null,
      carrierId: dto.carrierId !== undefined ? dto.carrierId : null,
      phone: dto.phone !== undefined ? dto.phone : null,
      street: dto.street !== undefined ? dto.street : null,
      number: dto.number !== undefined ? dto.number : null,
      complement: dto.complement !== undefined ? dto.complement : null,
      district: dto.district !== undefined ? dto.district : null,
      zipCode: dto.zipCode !== undefined ? dto.zipCode : null,
      city: dto.city !== undefined ? dto.city : null,
      state: dto.state !== undefined ? dto.state : null,
      latitude: dto.latitude !== undefined ? dto.latitude : null,
      longitude: dto.longitude !== undefined ? dto.longitude : null,
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      operatingHours: dto.operatingHours !== undefined ? dto.operatingHours : null,
      ...(dto.createdAt && { createdAt: new Date(dto.createdAt) }),
      ...(dto.updatedAt && { updatedAt: new Date(dto.updatedAt) }),
      // These are derived from relationships and typically not set directly
      establishmentName: dto.establishment?.name,
      carrierName: dto.carrier?.name
    };
  },

  /**
   * Convert UI model to DTO
   */
  fromUIModel(model: Partial<CollectionPointUI>): Partial<CollectionPointDTO> {
    return {
      id: model.id,
      name: model.name,
      address: model.address,
      establishmentId: model.establishment_id || null,
      establishment: model.establishment || null,
      carrierId: model.carrier_id || null,
      carrier: model.carrier || null,
      phone: model.phone || null,
      street: model.street || null,
      number: model.number || null,
      complement: model.complement || null,
      district: model.district || null,
      zipCode: model.zip_code || null,
      city: model.city || null,
      state: model.state || null,
      latitude: model.latitude || null,
      longitude: model.longitude || null,
      isActive: model.is_active !== null ? model.is_active : true,
      operatingHours: model.operating_hours || null,
      ...(model.created_at && { createdAt: model.created_at }),
      ...(model.updated_at && { updatedAt: model.updated_at })
    };
  },

  /**
   * Convert DTO to UI model
   */
  toUIModel(dto: CollectionPointDTO): CollectionPointUI {
    return {
      id: dto.id,
      name: dto.name,
      address: dto.address,
      establishment_id: dto.establishmentId,
      establishment: dto.establishment || null,
      carrier_id: dto.carrierId || null,
      phone: dto.phone,
      street: dto.street,
      number: dto.number,
      complement: dto.complement,
      district: dto.district,
      zip_code: dto.zipCode,
      city: dto.city,
      state: dto.state,
      latitude: dto.latitude,
      longitude: dto.longitude,
      is_active: dto.isActive,
      operating_hours: dto.operatingHours,
      created_at: dto.createdAt,
      updated_at: dto.updatedAt
    };
  },

  /**
   * Convert array of DTOs to UI models
   */
  toUIModelList(dtos: CollectionPointDTO[]): CollectionPointUI[] {
    return dtos.map(dto => this.toUIModel(dto));
  }
};
