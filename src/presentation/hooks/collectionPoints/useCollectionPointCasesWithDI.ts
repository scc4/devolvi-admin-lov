
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import { container } from '@/infrastructure/di/container';
import { CollectionPoint as CollectionPointUI } from '@/types/collection-point';
import { useCreateCollectionPoint } from './useCreateCollectionPoint';
import { useUpdateCollectionPoint } from './useUpdateCollectionPoint';
import { useDeleteCollectionPoint } from './useDeleteCollectionPoint';
import { useLoadCollectionPoints } from './useLoadCollectionPoints';
import { useAssignCarrier } from './useAssignCarrier';
import { collectionPointAdapter } from '@/adapters/collectionPoints/collectionPointAdapter';

// Define filters interface
export interface CollectionPointFilters {
  establishmentId?: string;
  carrierId?: string;
  unassigned?: boolean;
  cityFilter?: string;
}

/**
 * Hook para gerenciamento de pontos de coleta usando casos de uso com injeção de dependência
 */
export function useCollectionPointCasesWithDI(filters: CollectionPointFilters = {}) {
  console.log("useCollectionPointCasesWithDI called with filters:", filters);

  // Get services from container
  const getCollectionPointsUseCase = container.getCollectionPointsUseCase();
  const createCollectionPointUseCase = container.createCollectionPointUseCase();
  const updateCollectionPointUseCase = container.updateCollectionPointUseCase();
  const deleteCollectionPointUseCase = container.deleteCollectionPointUseCase();
  const assignCarrierToCollectionPointUseCase = container.assignCarrierToCollectionPointUseCase();

  // Initialize hooks
  const { loadCollectionPoints, collectionPoints, loading, error } = useLoadCollectionPoints(getCollectionPointsUseCase);
  const { handleCreate, isCreating } = useCreateCollectionPoint(createCollectionPointUseCase);
  const { handleUpdate, isUpdating } = useUpdateCollectionPoint(updateCollectionPointUseCase);
  const { handleDelete, isDeleting } = useDeleteCollectionPoint(deleteCollectionPointUseCase);
  const { handleAssignCarrier, isAssigningCarrier } = useAssignCarrier(assignCarrierToCollectionPointUseCase);
  
  // Carregamento de pontos de coleta com base nos filtros
  useEffect(() => {
    const fetchCollectionPoints = async () => {
      try {
        console.log("Loading collection points with filters:", filters);
        await loadCollectionPoints(filters);
      } catch (error) {
        console.error("Error fetching collection points:", error);
      }
    };

    fetchCollectionPoints();
  }, [filters, loadCollectionPoints]);

  // Wrapper para atribuir transportadora a um ponto de coleta
  const assignCarrier = async ({ collectionPointId, carrierId }: { 
    collectionPointId: string;
    carrierId: string | null;
  }) => {
    try {
      await handleAssignCarrier(collectionPointId, carrierId);
      await loadCollectionPoints(filters); // Recarregar após associação
    } catch (error) {
      console.error("Error assigning carrier:", error);
      throw error;
    }
  };

  // Criar um novo ponto de coleta
  const createCollectionPoint = async (collectionPoint: Partial<CollectionPointUI>) => {
    try {
      await handleCreate(collectionPoint);
      await loadCollectionPoints(filters); // Recarregar após criação
      return collectionPoint;
    } catch (error) {
      console.error("Error creating collection point:", error);
      throw error;
    }
  };

  // Atualizar um ponto de coleta existente
  const updateCollectionPoint = async (collectionPoint: Partial<CollectionPointUI>) => {
    try {
      await handleUpdate(collectionPoint);
      await loadCollectionPoints(filters); // Recarregar após atualização
      return collectionPoint;
    } catch (error) {
      console.error("Error updating collection point:", error);
      throw error;
    }
  };

  // Excluir um ponto de coleta
  const deleteCollectionPoint = async (collectionPointId: string) => {
    try {
      await handleDelete(collectionPointId);
      await loadCollectionPoints(filters); // Recarregar após exclusão
    } catch (error) {
      console.error("Error deleting collection point:", error);
      throw error;
    }
  };

  // Recarregar pontos de coleta
  const refetch = useCallback(async () => {
    try {
      console.log("Refetching collection points with filters:", filters);
      await loadCollectionPoints(filters);
    } catch (error) {
      console.error("Error refetching collection points:", error);
      throw error;
    }
  }, [filters, loadCollectionPoints]);

  return {
    collectionPoints,
    loading,
    error,
    refetch,
    createCollectionPoint,
    updateCollectionPoint,
    deleteCollectionPoint,
    assignCarrier,
    isCreating,
    isUpdating,
    isDeleting,
    isAssigningCarrier
  };
}
