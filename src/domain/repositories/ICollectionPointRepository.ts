
import { CollectionPoint } from '../entities/CollectionPoint';

/**
 * Interface for collection point repository
 */
export interface ICollectionPointRepository {
  getAll(): Promise<CollectionPoint[]>;
  getByEstablishment(establishmentId: string): Promise<CollectionPoint[]>;
  getByCarrier(carrierId: string): Promise<CollectionPoint[]>;
  getUnassigned(cityFilter?: string): Promise<CollectionPoint[]>;
  getById(id: string): Promise<CollectionPoint | null>;
  create(collectionPoint: Partial<CollectionPoint>): Promise<CollectionPoint>;
  update(collectionPoint: Partial<CollectionPoint>): Promise<CollectionPoint>;
  delete(id: string): Promise<void>;
  assignCarrier(collectionPointId: string, carrierId: string | null): Promise<CollectionPoint>;
}
