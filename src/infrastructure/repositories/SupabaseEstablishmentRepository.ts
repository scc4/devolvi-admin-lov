
import { supabase } from "../../integrations/supabase/client";
import { Establishment } from "../../domain/entities/Establishment";
import { IEstablishmentRepository } from "../../domain/repositories/IEstablishmentRepository";

/**
 * Supabase implementation of IEstablishmentRepository
 */
export class SupabaseEstablishmentRepository implements IEstablishmentRepository {
  
  async getAll(): Promise<Establishment[]> {
    const { data, error } = await supabase
      .from('establishments')
      .select(`
        *,
        collection_points(id),
        carrier:carriers(id, name)
      `)
      .order('name');

    if (error) {
      throw error;
    }

    return data.map(est => new Establishment(
      est.id,
      est.name,
      est.type as 'public' | 'private',
      est.carrier_id,
      new Date(est.created_at),
      new Date(est.updated_at),
      est.collection_points ? est.collection_points.length : 0
    ));
  }

  async getById(id: string): Promise<Establishment | null> {
    const { data, error } = await supabase
      .from('establishments')
      .select(`
        *,
        collection_points(id),
        carrier:carriers(id, name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return new Establishment(
      data.id,
      data.name,
      data.type as 'public' | 'private',
      data.carrier_id,
      new Date(data.created_at),
      new Date(data.updated_at),
      data.collection_points ? data.collection_points.length : 0
    );
  }

  async create(establishmentData: Partial<Establishment>): Promise<Establishment> {
    const { data, error } = await supabase
      .from('establishments')
      .insert({
        name: establishmentData.name,
        type: establishmentData.type,
        carrier_id: establishmentData.carrierId || null
      })
      .select(`
        *,
        collection_points(id),
        carrier:carriers(id, name)
      `)
      .single();

    if (error) {
      throw error;
    }

    return new Establishment(
      data.id,
      data.name,
      data.type as 'public' | 'private',
      data.carrier_id,
      new Date(data.created_at),
      new Date(data.updated_at),
      data.collection_points ? data.collection_points.length : 0
    );
  }

  async update(establishmentData: Partial<Establishment>): Promise<Establishment> {
    if (!establishmentData.id) {
      throw new Error('Establishment ID is required for update');
    }

    const updateData: any = {};
    if (establishmentData.name) updateData.name = establishmentData.name;
    if (establishmentData.type) updateData.type = establishmentData.type;
    if (establishmentData.carrierId !== undefined) updateData.carrier_id = establishmentData.carrierId;

    const { data, error } = await supabase
      .from('establishments')
      .update(updateData)
      .eq('id', establishmentData.id)
      .select(`
        *,
        collection_points(id),
        carrier:carriers(id, name)
      `)
      .single();

    if (error) {
      throw error;
    }

    return new Establishment(
      data.id,
      data.name,
      data.type as 'public' | 'private',
      data.carrier_id,
      new Date(data.created_at),
      new Date(data.updated_at),
      data.collection_points ? data.collection_points.length : 0
    );
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('establishments')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
}
