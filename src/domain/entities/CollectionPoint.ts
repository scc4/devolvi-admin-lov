
/**
 * Collection Point domain entity
 */
export class CollectionPoint {
  id: string;
  name: string;
  address: string;
  establishmentId: string | null;
  carrierId: string | null;
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
  operatingHours: OperatingHours | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    address: string,
    establishmentId: string | null = null,
    carrierId: string | null = null,
    phone: string | null = null,
    street: string | null = null,
    number: string | null = null,
    complement: string | null = null,
    district: string | null = null,
    zipCode: string | null = null,
    city: string | null = null,
    state: string | null = null,
    latitude: number | null = null,
    longitude: number | null = null,
    isActive: boolean = true,
    operatingHours: OperatingHours | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.establishmentId = establishmentId;
    this.carrierId = carrierId;
    this.phone = phone;
    this.street = street;
    this.number = number;
    this.complement = complement;
    this.district = district;
    this.zipCode = zipCode;
    this.city = city;
    this.state = state;
    this.latitude = latitude;
    this.longitude = longitude;
    this.isActive = isActive;
    this.operatingHours = operatingHours;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

/**
 * Type definition for operating hours
 */
export type OperatingHours = {
  [day: string]: {
    open: string;
    close: string;
  }[];
};
