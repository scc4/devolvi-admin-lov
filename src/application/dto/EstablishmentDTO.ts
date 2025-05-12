
/**
 * Data Transfer Object for Establishment entity
 */
export interface EstablishmentDTO {
  id: string;
  name: string;
  type: 'public' | 'private';
  carrierId?: string | null;
  createdAt: string;
  updatedAt: string;
  collectionPointsCount?: number;
  carrier?: {
    id: string;
    name: string;
  } | null;
}
