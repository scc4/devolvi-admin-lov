
import { User } from '../../domain/entities/User';
import { UserDTO } from '../../application/dto/UserDTO';
import { UserRow } from '../../types/user';

/**
 * Adapter to convert between domain entities, DTOs and UI models for Users
 */
export const userAdapter = {
  /**
   * Convert domain entity to DTO
   */
  toDTO(entity: User): UserDTO {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      phone: entity.phone,
      role: entity.role,
      status: entity.status,
      createdAt: entity.createdAt.toISOString()
    };
  },

  /**
   * Convert DTO to domain entity
   */
  toDomainEntity(dto: UserDTO): User {
    return new User({
      id: dto.id,
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
      role: dto.role,
      status: dto.status,
      createdAt: new Date(dto.createdAt)
    });
  },

  /**
   * Convert UI model to DTO
   * Maps created_at from UserRow to createdAt for UserDTO
   */
  fromUIModel(model: UserRow): UserDTO {
    return {
      id: model.id,
      email: model.email,
      name: model.name,
      phone: model.phone,
      role: model.role,
      status: model.status,
      createdAt: model.created_at // Este é o ponto crítico de conversão
    };
  },

  /**
   * Convert DTO to UI model
   * Maps createdAt from UserDTO to created_at for UserRow
   */
  toUIModel(dto: UserDTO): UserRow {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      created_at: dto.createdAt, // Este é o ponto crítico de conversão
      role: dto.role,
      status: dto.status
    };
  },

  /**
   * Convert list of DTOs to UI models
   */
  toUIModelList(dtos: UserDTO[]): UserRow[] {
    return dtos.map(dto => this.toUIModel(dto));
  }
};
