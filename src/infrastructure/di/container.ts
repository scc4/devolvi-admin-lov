import { GetAllUsersUseCase } from '../../application/useCases/user/GetAllUsersUseCase';
import { DeleteUserUseCase } from '../../application/useCases/user/DeleteUserUseCase';
import { DeactivateUserUseCase } from '../../application/useCases/user/DeactivateUserUseCase';
import { CreateEstablishmentUseCase } from '../../application/useCases/establishment/CreateEstablishmentUseCase';
import { GetAllEstablishmentsUseCase } from '../../application/useCases/establishment/GetAllEstablishmentsUseCase';
import { UpdateEstablishmentUseCase } from '../../application/useCases/establishment/UpdateEstablishmentUseCase';
import { DeleteEstablishmentUseCase } from '../../application/useCases/establishment/DeleteEstablishmentUseCase';
import { GetAllCarriersUseCase } from '../../application/useCases/carrier/GetAllCarriersUseCase';
import { CreateCarrierUseCase } from '../../application/useCases/carrier/CreateCarrierUseCase';
import { UpdateCarrierUseCase } from '../../application/useCases/carrier/UpdateCarrierUseCase';
import { DeleteCarrierUseCase } from '../../application/useCases/carrier/DeleteCarrierUseCase';
import { DeactivateCarrierUseCase } from '../../application/useCases/carrier/DeactivateCarrierUseCase';
import { GetCollectionPointsUseCase } from '../../application/useCases/collectionPoint/GetCollectionPointsUseCase';
import { CreateCollectionPointUseCase } from '../../application/useCases/collectionPoint/CreateCollectionPointUseCase';
import { UpdateCollectionPointUseCase } from '../../application/useCases/collectionPoint/UpdateCollectionPointUseCase';
import { DeleteCollectionPointUseCase } from '../../application/useCases/collectionPoint/DeleteCollectionPointUseCase';
import { AssignCarrierToCollectionPointUseCase } from '../../application/useCases/collectionPoint/AssignCarrierToCollectionPointUseCase';
import { SupabaseUserRepository } from '../repositories/SupabaseUserRepository';
import { SupabaseEstablishmentRepository } from '../repositories/SupabaseEstablishmentRepository';
import { SupabaseCarrierRepository } from '../repositories/SupabaseCarrierRepository';
import { SupabaseCollectionPointRepository } from '../repositories/SupabaseCollectionPointRepository';
import { ResetPasswordUseCase } from '../../application/useCases/user/ResetPasswordUseCase';

// Create repository instances
const userRepository = new SupabaseUserRepository();
const establishmentRepository = new SupabaseEstablishmentRepository();
const carrierRepository = new SupabaseCarrierRepository();
const collectionPointRepository = new SupabaseCollectionPointRepository();

// Only add the reset password use case method if it doesn't already exist
export const container = {
  getAllUsersUseCase: () => {
    return new GetAllUsersUseCase(userRepository);
  },
  deleteUserUseCase: () => {
    return new DeleteUserUseCase(userRepository);
  },
  deactivateUserUseCase: () => {
    return new DeactivateUserUseCase(userRepository);
  },
  createEstablishmentUseCase: () => {
    return new CreateEstablishmentUseCase(establishmentRepository);
  },
  getAllEstablishmentsUseCase: () => {
    return new GetAllEstablishmentsUseCase(establishmentRepository);
  },
  updateEstablishmentUseCase: () => {
    return new UpdateEstablishmentUseCase(establishmentRepository);
  },
  deleteEstablishmentUseCase: () => {
    return new DeleteEstablishmentUseCase(establishmentRepository);
  },
  getAllCarriersUseCase: () => {
    return new GetAllCarriersUseCase(carrierRepository);
  },
  createCarrierUseCase: () => {
    return new CreateCarrierUseCase(carrierRepository);
  },
  updateCarrierUseCase: () => {
    return new UpdateCarrierUseCase(carrierRepository);
  },
  deleteCarrierUseCase: () => {
    return new DeleteCarrierUseCase(carrierRepository);
  },
  deactivateCarrierUseCase: () => {
    return new DeactivateCarrierUseCase(carrierRepository);
  },
  getCollectionPointsUseCase: () => {
    return new GetCollectionPointsUseCase(collectionPointRepository);
  },
  createCollectionPointUseCase: () => {
    return new CreateCollectionPointUseCase(collectionPointRepository);
  },
  updateCollectionPointUseCase: () => {
    return new UpdateCollectionPointUseCase(collectionPointRepository);
  },
  deleteCollectionPointUseCase: () => {
    return new DeleteCollectionPointUseCase(collectionPointRepository);
  },
  assignCarrierToCollectionPointUseCase: () => {
    return new AssignCarrierToCollectionPointUseCase(collectionPointRepository);
  },
  resetPasswordUseCase: () => {
    return new ResetPasswordUseCase(userRepository);
  },
};
