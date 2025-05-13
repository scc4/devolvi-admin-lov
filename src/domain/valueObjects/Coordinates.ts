
/**
 * Value Object representing geographic coordinates
 * Encapsulates validation logic and operations for coordinates
 */
export class Coordinates {
  private readonly latitude: number | null;
  private readonly longitude: number | null;

  constructor(latitude: number | null, longitude: number | null) {
    // Basic validation
    if (latitude !== null && (latitude < -90 || latitude > 90)) {
      throw new Error('Latitude must be between -90 and 90 degrees');
    }
    
    if (longitude !== null && (longitude < -180 || longitude > 180)) {
      throw new Error('Longitude must be between -180 and 180 degrees');
    }
    
    this.latitude = latitude;
    this.longitude = longitude;
  }

  /**
   * Get the latitude
   */
  getLatitude(): number | null {
    return this.latitude;
  }

  /**
   * Get the longitude
   */
  getLongitude(): number | null {
    return this.longitude;
  }

  /**
   * Check if the coordinates are defined (not null)
   */
  isDefined(): boolean {
    return this.latitude !== null && this.longitude !== null;
  }

  /**
   * Format the coordinates as a string
   */
  toString(): string {
    if (!this.isDefined()) {
      return 'Coordenadas não definidas';
    }
    
    return `${this.latitude}, ${this.longitude}`;
  }

  /**
   * Calculate the distance to another coordinate in kilometers
   * Uses the Haversine formula for calculating great-circle distance
   */
  distanceTo(other: Coordinates): number | null {
    if (!this.isDefined() || !other.isDefined()) {
      return null;
    }
    
    const lat1 = this.latitude!;
    const lon1 = this.longitude!;
    const lat2 = other.latitude!;
    const lon2 = other.longitude!;
    
    const R = 6371; // Radius of the Earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    
    return distance;
  }

  /**
   * Convert degrees to radians
   */
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Check if two coordinates are equal
   */
  equals(other: Coordinates): boolean {
    return this.latitude === other.latitude && 
           this.longitude === other.longitude;
  }

  /**
   * Create a copy of this Coordinates with updated values
   */
  withUpdates(params: { latitude?: number | null; longitude?: number | null }): Coordinates {
    return new Coordinates(
      params.latitude !== undefined ? params.latitude : this.latitude,
      params.longitude !== undefined ? params.longitude : this.longitude
    );
  }
}
