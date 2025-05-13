
import { supabase } from '../../integrations/supabase/client';
import { CollectionPoint } from '../../domain/entities/CollectionPoint';
import { ICollectionPointRepository } from '../../domain/repositories/ICollectionPointRepository';

/**
 * Supabase implementation of the collection point repository
 */
export class SupabaseCollectionPointRepository implements ICollectionPointRepository {
  /**
   * Get all collection points
   */
  async getAll(): Promise<CollectionPoint[]> {
    const { data, error } = await supabase
      .from('collection_points')
      .select(`
        *,
        establishment:establishments(name)
      `)
      .order('name');

    if (error) {
      console.error('Error fetching collection points:', error);
      throw error;
    }

    return this.mapToDomainEntities(data);
  }

  /**
   * Get collection points by establishment
   */
  async getByEstablishment(establishmentId: string): Promise<CollectionPoint[]> {
    const { data, error } = await supabase
      .from('collection_points')
      .select(`
        *,
        establishment:establishments(name)
      `)
      .eq('establishment_id', establishmentId)
      .order('name');

    if (error) {
      console.error('Error fetching collection points by establishment:', error);
      throw error;
    }

    return this.mapToDomainEntities(data);
  }

  /**
   * Get collection points by carrier
   */
  async getByCarrier(carrierId: string): Promise<CollectionPoint[]> {
    const { data, error } = await supabase
      .from('collection_points')
      .select(`
        *,
        establishment:establishments(name)
      `)
      .eq('carrier_id', carrierId)
      .order('name');

    if (error) {
      console.error('Error fetching collection points by carrier:', error);
      throw error;
    }

    return this.mapToDomainEntities(data);
  }

  /**
   * Get unassigned collection points
   */
  async getUnassigned(cityFilter?: string): Promise<CollectionPoint[]> {
    let query = supabase
      .from('collection_points')
      .select(`
        *,
        establishment:establishments(name)
      `)
      .is('carrier_id', null);
    
    if (cityFilter) {
      query = query.eq('city', cityFilter);
    }
    
    const { data, error } = await query.order('name');

    if (error) {
      console.error('Error fetching unassigned collection points:', error);
      throw error;
    }

    return this.mapToDomainEntities(data);
  }

  /**
   * Get a collection point by ID
   */
  async getById(id: string): Promise<CollectionPoint | null> {
    const { data, error } = await supabase
      .from('collection_points')
      .select(`
        *,
        establishment:establishments(name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null;
      }
      console.error('Error fetching collection point by ID:', error);
      throw error;
    }

    return this.mapToDomainEntity(data);
  }

  /**
   * Create a new collection point
   */
  async create(collectionPoint: Partial<CollectionPoint>): Promise<CollectionPoint> {
    const dataToInsert = this.mapFromDomainEntity(collectionPoint);

    // Add address if not provided
    if (!dataToInsert.address) {
      dataToInsert.address = this.generateAddressString(dataToInsert);
    }

    const { data, error } = await supabase
      .from('collection_points')
      .insert(dataToInsert)
      .select('*, establishment:establishments(name)')
      .single();

    if (error) {
      console.error('Error creating collection point:', error);
      throw error;
    }

    return this.mapToDomainEntity(data);
  }

  /**
   * Update a collection point
   */
  async update(collectionPoint: Partial<CollectionPoint>): Promise<CollectionPoint> {
    if (!collectionPoint.id) {
      throw new Error('Collection point ID is required for update');
    }

    const dataToUpdate = this.mapFromDomainEntity(collectionPoint);
    
    // Update address if needed
    if (
      collectionPoint.street !== undefined || 
      collectionPoint.number !== undefined || 
      collectionPoint.city !== undefined ||
      collectionPoint.state !== undefined
    ) {
      dataToUpdate.address = this.generateAddressString(dataToUpdate);
    }

    const { data, error } = await supabase
      .from('collection_points')
      .update(dataToUpdate)
      .eq('id', collectionPoint.id)
      .select('*, establishment:establishments(name)')
      .single();

    if (error) {
      console.error('Error updating collection point:', error);
      throw error;
    }

    return this.mapToDomainEntity(data);
  }

  /**
   * Delete a collection point
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('collection_points')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting collection point:', error);
      throw error;
    }
  }

  /**
   * Assign a carrier to a collection point
   */
  async assignCarrier(collectionPointId: string, carrierId: string | null): Promise<CollectionPoint> {
    const { data, error } = await supabase
      .from('collection_points')
      .update({ carrier_id: carrierId })
      .eq('id', collectionPointId)
      .select('*, establishment:establishments(name)')
      .single();

    if (error) {
      console.error('Error assigning carrier to collection point:', error);
      throw error;
    }

    return this.mapToDomainEntity(data);
  }

  /**
   * Map database data to domain entity
   */
  private mapToDomainEntity(data: any): CollectionPoint {
    return new CollectionPoint(
      data.id,
      data.name,
      data.address,
      data.establishment_id,
      data.carrier_id,
      data.phone,
      data.street,
      data.number,
      data.complement,
      data.district,
      data.zip_code,
      data.city,
      data.state,
      data.latitude,
      data.longitude,
      data.is_active,
      data.operating_hours,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }

  /**
   * Map multiple database rows to domain entities
   */
  private mapToDomainEntities(data: any[]): CollectionPoint[] {
    return data.map(item => this.mapToDomainEntity(item));
  }

  /**
   * Convert domain entity to database format
   */
  private mapFromDomainEntity(collectionPoint: Partial<CollectionPoint>): any {
    const result: any = {};

    // Map only the fields that are defined
    if (collectionPoint.id !== undefined) result.id = collectionPoint.id;
    if (collectionPoint.name !== undefined) result.name = collectionPoint.name;
    if (collectionPoint.address !== undefined) result.address = collectionPoint.address;
    if (collectionPoint.establishmentId !== undefined) result.establishment_id = collectionPoint.establishmentId;
    if (collectionPoint.carrierId !== undefined) result.carrier_id = collectionPoint.carrierId;
    if (collectionPoint.phone !== undefined) result.phone = collectionPoint.phone;
    if (collectionPoint.street !== undefined) result.street = collectionPoint.street;
    if (collectionPoint.number !== undefined) result.number = collectionPoint.number;
    if (collectionPoint.complement !== undefined) result.complement = collectionPoint.complement;
    if (collectionPoint.district !== undefined) result.district = collectionPoint.district;
    if (collectionPoint.zipCode !== undefined) result.zip_code = collectionPoint.zipCode;
    if (collectionPoint.city !== undefined) result.city = collectionPoint.city;
    if (collectionPoint.state !== undefined) result.state = collectionPoint.state;
    if (collectionPoint.latitude !== undefined) result.latitude = collectionPoint.latitude;
    if (collectionPoint.longitude !== undefined) result.longitude = collectionPoint.longitude;
    if (collectionPoint.isActive !== undefined) result.is_active = collectionPoint.isActive;
    if (collectionPoint.operatingHours !== undefined) result.operating_hours = collectionPoint.operatingHours;

    return result;
  }

  /**
   * Generate an address string from individual fields
   */
  private generateAddressString(data: any): string {
    const parts = [];
    
    if (data.street) parts.push(data.street);
    if (data.number) parts.push(data.number);
    if (data.complement) parts.push(data.complement);
    if (data.district) parts.push(`${data.district}`);
    if (data.city) parts.push(data.city);
    if (data.state) parts.push(data.state);
    if (data.zip_code) parts.push(`CEP: ${data.zip_code}`);
    
    return parts.length > 0 ? parts.join(', ') : data.name || 'Sem endereço';
  }
}
