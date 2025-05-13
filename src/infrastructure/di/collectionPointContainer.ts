
import { ICollectionPointRepository } from '../../domain/repositories/ICollectionPointRepository';
import { SupabaseCollectionPointRepository } from '../repositories/SupabaseCollectionPointRepository';
import { GetCollectionPointsUseCase } from '../../application/useCases/collectionPoint/GetCollectionPointsUseCase';
import { GetCollectionPointByIdUseCase } from '../../application/useCases/collectionPoint/GetCollectionPointByIdUseCase';
import { CreateCollectionPointUseCase } from '../../application/useCases/collectionPoint/CreateCollectionPointUseCase';
import { UpdateCollectionPointUseCase } from '../../application/useCases/collectionPoint/UpdateCollectionPointUseCase';
import { DeleteCollectionPointUseCase } from '../../application/useCases/collectionPoint/DeleteCollectionPointUseCase';
import { AssignCarrierToCollectionPointUseCase } from '../../application/useCases/collectionPoint/AssignCarrierToCollectionPointUseCase';

/**
 * Collection Point module dependency injection container
 */
export class CollectionPointContainer {
  private instances: Map<string, any> = new Map();

  // Collection Point repository
  getCollectionPointRepository(): ICollectionPointRepository {
    const key = 'collectionPointRepository';
    if (!this.instances.has(key)) {
      this.instances.set(key, new SupabaseCollectionPointRepository());
    }
    return this.instances.get(key);
  }

  // Collection Point use cases
  getCollectionPointsUseCase(): GetCollectionPointsUseCase {
    const key = 'getCollectionPointsUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new GetCollectionPointsUseCase(this.getCollectionPointRepository())
      );
    }
    return this.instances.get(key);
  }

  getCollectionPointByIdUseCase(): GetCollectionPointByIdUseCase {
    const key = 'getCollectionPointByIdUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new GetCollectionPointByIdUseCase(this.getCollectionPointRepository())
      );
    }
    return this.instances.get(key);
  }

  createCollectionPointUseCase(): CreateCollectionPointUseCase {
    const key = 'createCollectionPointUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new CreateCollectionPointUseCase(this.getCollectionPointRepository())
      );
    }
    return this.instances.get(key);
  }

  updateCollectionPointUseCase(): UpdateCollectionPointUseCase {
    const key = 'updateCollectionPointUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new UpdateCollectionPointUseCase(this.getCollectionPointRepository())
      );
    }
    return this.instances.get(key);
  }

  deleteCollectionPointUseCase(): DeleteCollectionPointUseCase {
    const key = 'deleteCollectionPointUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new DeleteCollectionPointUseCase(this.getCollectionPointRepository())
      );
    }
    return this.instances.get(key);
  }

  assignCarrierToCollectionPointUseCase(): AssignCarrierToCollectionPointUseCase {
    const key = 'assignCarrierToCollectionPointUseCase';
    if (!this.instances.has(key)) {
      this.instances.set(
        key,
        new AssignCarrierToCollectionPointUseCase(this.getCollectionPointRepository())
      );
    }
    return this.instances.get(key);
  }
}

// Create a singleton instance
export const collectionPointContainer = new CollectionPointContainer();
