
/**
 * Data Transfer Object for CollectionPoint entity
 */
export interface CollectionPointDTO {
  id: string;
  name: string;
  address: string;
  establishmentId: string | null;
  establishment?: {
    name: string;
  } | null;
  carrierId: string | null;
  carrier?: {
    name: string;
  } | null;
  phone: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  district: string | null;
  zipCode: string | null;
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
  operatingHours: {
    [day: string]: {
      open: string;
      close: string;
    }[];
  } | null;
  createdAt: string;
  updatedAt: string;
}
