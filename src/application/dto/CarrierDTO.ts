
/**
 * Data Transfer Object for Carrier entity
 */
export interface CarrierDTO {
  id: string;
  name: string;
  city: string;
  manager: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  collectionPointsCount?: number;
}
