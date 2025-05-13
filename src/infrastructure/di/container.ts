
import { userContainer } from './userContainer';
import { carrierContainer } from './carrierContainer';
import { establishmentContainer } from './establishmentContainer';
import { collectionPointContainer } from './collectionPointContainer';

/**
 * Main dependency injection container
 * Aggregates all module-specific containers
 */
class Container {
  // USER MODULE
  getUserRepository() {
    return userContainer.getUserRepository();
  }

  getAllUsersUseCase() {
    return userContainer.getAllUsersUseCase();
  }

  deleteUserUseCase() {
    return userContainer.deleteUserUseCase();
  }

  deactivateUserUseCase() {
    return userContainer.deactivateUserUseCase();
  }

  resetPasswordUseCase() {
    return userContainer.resetPasswordUseCase();
  }

  // CARRIER MODULE
  getCarrierRepository() {
    return carrierContainer.getCarrierRepository();
  }

  getAllCarriersUseCase() {
    return carrierContainer.getAllCarriersUseCase();
  }

  createCarrierUseCase() {
    return carrierContainer.createCarrierUseCase();
  }

  updateCarrierUseCase() {
    return carrierContainer.updateCarrierUseCase();
  }

  deleteCarrierUseCase() {
    return carrierContainer.deleteCarrierUseCase();
  }

  deactivateCarrierUseCase() {
    return carrierContainer.deactivateCarrierUseCase();
  }

  // ESTABLISHMENT MODULE
  getEstablishmentRepository() {
    return establishmentContainer.getEstablishmentRepository();
  }

  getAllEstablishmentsUseCase() {
    return establishmentContainer.getAllEstablishmentsUseCase();
  }

  createEstablishmentUseCase() {
    return establishmentContainer.createEstablishmentUseCase();
  }

  updateEstablishmentUseCase() {
    return establishmentContainer.updateEstablishmentUseCase();
  }

  deleteEstablishmentUseCase() {
    return establishmentContainer.deleteEstablishmentUseCase();
  }

  // COLLECTION POINT MODULE
  getCollectionPointRepository() {
    return collectionPointContainer.getCollectionPointRepository();
  }

  getCollectionPointsUseCase() {
    return collectionPointContainer.getCollectionPointsUseCase();
  }

  getCollectionPointByIdUseCase() {
    return collectionPointContainer.getCollectionPointByIdUseCase();
  }

  createCollectionPointUseCase() {
    return collectionPointContainer.createCollectionPointUseCase();
  }

  updateCollectionPointUseCase() {
    return collectionPointContainer.updateCollectionPointUseCase();
  }

  deleteCollectionPointUseCase() {
    return collectionPointContainer.deleteCollectionPointUseCase();
  }

  assignCarrierToCollectionPointUseCase() {
    return collectionPointContainer.assignCarrierToCollectionPointUseCase();
  }
}

// Export a singleton instance of the container
export const container = new Container();
