
import { CollectionPoint } from './CollectionPoint';

/**
 * Establishment domain entity
 */
export class Establishment {
  id: string;
  name: string;
  type: 'public' | 'private';
  carrierId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  collectionPoints?: CollectionPoint[];
  collectionPointsCount?: number;

  constructor(
    id: string,
    name: string,
    type: 'public' | 'private',
    carrierId: string | null = null,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    collectionPointsCount: number = 0
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.carrierId = carrierId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.collectionPointsCount = collectionPointsCount;
  }
}
