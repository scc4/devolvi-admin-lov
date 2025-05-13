
import { useState, useCallback } from 'react';
import { GetCollectionPointsUseCase } from '@/application/useCases/collectionPoint/GetCollectionPointsUseCase';
import { collectionPointAdapter } from '@/adapters/collectionPoints/collectionPointAdapter';
import { CollectionPoint as CollectionPointUI } from '@/types/collection-point';
import { CollectionPointFilters } from './useCollectionPointCasesWithDI';

/**
 * Hook to load collection points
 */
export function useLoadCollectionPoints(getCollectionPointsUseCase: GetCollectionPointsUseCase) {
  const [collectionPoints, setCollectionPoints] = useState<CollectionPointUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCollectionPoints = useCallback(async (filters: CollectionPointFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the execute method with filters
      const domainCollectionPoints = await getCollectionPointsUseCase.execute(filters);
      
      const uiCollectionPoints = domainCollectionPoints.map(point => 
        collectionPointAdapter.toUIModel(point)
      );
      
      setCollectionPoints(uiCollectionPoints);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load collection points';
      setError(errorMessage);
      console.error('Error loading collection points:', err);
    } finally {
      setLoading(false);
    }
  }, [getCollectionPointsUseCase]);

  return {
    loadCollectionPoints,
    collectionPoints,
    loading,
    error
  };
}
