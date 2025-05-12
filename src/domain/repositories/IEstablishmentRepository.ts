
import { Establishment } from '../entities/Establishment';

/**
 * Interface for establishment repository
 */
export interface IEstablishmentRepository {
  getAll(): Promise<Establishment[]>;
  getById(id: string): Promise<Establishment | null>;
  create(establishment: Partial<Establishment>): Promise<Establishment>;
  update(establishment: Partial<Establishment>): Promise<Establishment>;
  delete(id: string): Promise<void>;
}
