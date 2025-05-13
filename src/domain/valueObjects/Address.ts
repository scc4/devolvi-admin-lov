
/**
 * Value Object representing a complete address
 * Encapsulates validation logic and formatting for addresses
 */
export class Address {
  private readonly street: string | null;
  private readonly number: string | null;
  private readonly complement: string | null;
  private readonly district: string | null;
  private readonly zipCode: string | null;
  private readonly city: string | null;
  private readonly state: string | null;

  constructor(params: {
    street: string | null;
    number: string | null;
    complement: string | null;
    district: string | null;
    zipCode: string | null;
    city: string | null;
    state: string | null;
  }) {
    this.street = params.street;
    this.number = params.number;
    this.complement = params.complement;
    this.district = params.district;
    this.zipCode = params.zipCode;
    this.city = params.city;
    this.state = params.state;
  }

  /**
   * Get the street
   */
  getStreet(): string | null {
    return this.street;
  }

  /**
   * Get the number
   */
  getNumber(): string | null {
    return this.number;
  }

  /**
   * Get the complement
   */
  getComplement(): string | null {
    return this.complement;
  }

  /**
   * Get the district/neighborhood
   */
  getDistrict(): string | null {
    return this.district;
  }

  /**
   * Get the ZIP code
   */
  getZipCode(): string | null {
    return this.zipCode;
  }

  /**
   * Get the city
   */
  getCity(): string | null {
    return this.city;
  }

  /**
   * Get the state
   */
  getState(): string | null {
    return this.state;
  }

  /**
   * Format the complete address as a single line
   */
  getFormattedAddress(): string {
    const parts: string[] = [];
    
    if (this.street) parts.push(this.street);
    if (this.number) parts.push(this.number);
    if (this.complement) parts.push(this.complement);
    
    const firstLine = parts.join(', ');
    
    const secondLineParts: string[] = [];
    if (this.district) secondLineParts.push(this.district);
    if (this.city) secondLineParts.push(this.city);
    if (this.state) secondLineParts.push(this.state);
    if (this.zipCode) secondLineParts.push(`CEP: ${this.zipCode}`);
    
    const secondLine = secondLineParts.join(' - ');
    
    return [firstLine, secondLine].filter(Boolean).join('. ');
  }

  /**
   * Check if the address is completely filled
   */
  isComplete(): boolean {
    return !!(this.street && this.number && this.district && this.city && this.state && this.zipCode);
  }

  /**
   * Create a new Address with updated values
   */
  withUpdates(params: Partial<{
    street: string | null;
    number: string | null;
    complement: string | null;
    district: string | null;
    zipCode: string | null;
    city: string | null;
    state: string | null;
  }>): Address {
    return new Address({
      street: params.street !== undefined ? params.street : this.street,
      number: params.number !== undefined ? params.number : this.number,
      complement: params.complement !== undefined ? params.complement : this.complement,
      district: params.district !== undefined ? params.district : this.district,
      zipCode: params.zipCode !== undefined ? params.zipCode : this.zipCode,
      city: params.city !== undefined ? params.city : this.city,
      state: params.state !== undefined ? params.state : this.state
    });
  }

  /**
   * Check if two addresses are equal
   */
  equals(other: Address): boolean {
    return this.street === other.street &&
      this.number === other.number &&
      this.complement === other.complement &&
      this.district === other.district &&
      this.zipCode === other.zipCode &&
      this.city === other.city &&
      this.state === other.state;
  }
}
