
import { supabase } from '@/integrations/supabase/client';
import { Carrier } from '../../domain/entities/Carrier';
import { ICarrierRepository } from '../../domain/repositories/ICarrierRepository';

/**
 * Supabase implementation of the Carrier repository
 */
export class SupabaseCarrierRepository implements ICarrierRepository {
  async getAll(): Promise<Carrier[]> {
    const { data, error } = await supabase
      .from('carriers')
      .select('*')
      .order('name');

    if (error) throw error;

    return data.map(item => this.mapToEntity(item));
  }

  async getById(id: string): Promise<Carrier | null> {
    const { data, error } = await supabase
      .from('carriers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Record not found
      throw error;
    }

    return this.mapToEntity(data);
  }

  async create(carrier: Carrier): Promise<Carrier> {
    const { data, error } = await supabase
      .from('carriers')
      .insert({
        id: carrier.id,
        name: carrier.name,
        city: carrier.city,
        manager: carrier.manager,
        phone: carrier.phone,
        email: carrier.email,
        is_active: carrier.isActive,
        created_at: carrier.createdAt.toISOString(),
        updated_at: carrier.updatedAt.toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return this.mapToEntity(data);
  }

  async update(carrier: Carrier): Promise<Carrier> {
    const { data, error } = await supabase
      .from('carriers')
      .update({
        name: carrier.name,
        city: carrier.city,
        manager: carrier.manager,
        phone: carrier.phone,
        email: carrier.email,
        is_active: carrier.isActive,
        updated_at: carrier.updatedAt.toISOString()
      })
      .eq('id', carrier.id)
      .select()
      .single();

    if (error) throw error;

    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('carriers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async deactivate(id: string): Promise<void> {
    const { error } = await supabase
      .from('carriers')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;
  }

  async getCarriersByCity(city: string): Promise<Carrier[]> {
    const { data, error } = await supabase
      .from('carriers')
      .select('*')
      .eq('city', city)
      .eq('is_active', true);

    if (error) throw error;

    return data.map(item => this.mapToEntity(item));
  }

  /**
   * Maps a database record to a Carrier domain entity
   */
  private mapToEntity(record: any): Carrier {
    return new Carrier({
      id: record.id,
      name: record.name,
      city: record.city,
      manager: record.manager,
      phone: record.phone,
      email: record.email,
      isActive: record.is_active,
      createdAt: new Date(record.created_at),
      updatedAt: new Date(record.updated_at)
    });
  }
}
