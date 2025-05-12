
import { Carrier } from '../entities/Carrier';

/**
 * Interface defining the contract for Carrier repository implementations
 */
export interface ICarrierRepository {
  getAll(): Promise<Carrier[]>;
  getById(id: string): Promise<Carrier | null>;
  create(carrier: Carrier): Promise<Carrier>;
  update(carrier: Carrier): Promise<Carrier>;
  delete(id: string): Promise<void>;
  deactivate(id: string): Promise<void>;
  getCarriersByCity(city: string): Promise<Carrier[]>;
}
