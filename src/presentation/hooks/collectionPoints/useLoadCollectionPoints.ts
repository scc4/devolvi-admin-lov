
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from "sonner";
import { collectionPointAdapter } from '../../../adapters/collectionPoints/collectionPointAdapter';
import { CollectionPoint as CollectionPointUI } from '../../../types/collection-point';
import { handleCollectionPointError, isRequestAborted } from './utils';

interface LoadingState {
  isLoading: boolean;
  isFirstLoad: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

/**
 * Hook para carregamento de pontos de coleta
 */
export function useLoadCollectionPoints(
  getCollectionPointsUseCase: any,
  filters?: {
    establishmentId?: string;
    carrierId?: string;
    unassigned?: boolean;
    cityFilter?: string;
  }
) {
  const [collectionPoints, setCollectionPoints] = useState<CollectionPointUI[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    isFirstLoad: true,
    hasError: false,
    errorMessage: null
  });
  
  // Use refs para evitar loops infinitos
  const filtersRef = useRef(filters);
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef<number>(0);
  const isMountedRef = useRef<boolean>(true);
  
  // Effect to update filters ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);
  
  // Effect to handle component unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadCollectionPoints = useCallback(async (forceRefresh = false) => {
    // Prevent loading if not mounted
    if (!isMountedRef.current) return;
    
    // Generate a unique request ID to track current request
    const currentRequestId = ++requestIdRef.current;
    
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    // Mark as loading
    setLoadingState(prev => ({
      ...prev,
      isLoading: true,
      hasError: false,
      errorMessage: null
    }));
    
    try {
      console.log(`[${currentRequestId}] Loading collection points with filters:`, filtersRef.current);
      
      // Execute use case to load data
      const collectionPointDTOs = await getCollectionPointsUseCase.execute(filtersRef.current);
      
      // Ignore response if not the current request or component unmounted
      if (requestIdRef.current !== currentRequestId || !isMountedRef.current) {
        console.log(`[${currentRequestId}] Request outdated or component unmounted, ignoring response`);
        return;
      }
      
      // Verify if request was aborted
      if (isRequestAborted(abortControllerRef.current)) {
        console.log(`[${currentRequestId}] Request was aborted, skipping state update`);
        return;
      }
      
      console.log(`[${currentRequestId}] Collection points loaded:`, collectionPointDTOs?.length || 0);
      
      // Convert to UI models
      const uiModels = collectionPointDTOs ? collectionPointAdapter.toUIModelList(collectionPointDTOs) : [];
      console.log(`[${currentRequestId}] Collection points UI models:`, uiModels.length);
      
      // Update state only if component is still mounted
      if (isMountedRef.current) {
        setCollectionPoints(uiModels);
        setLoadingState(prev => ({
          ...prev,
          isLoading: false,
          isFirstLoad: false
        }));
      }
    } catch (err) {
      // Skip error handling if request was aborted or component unmounted
      if (isRequestAborted(abortControllerRef.current) || !isMountedRef.current) {
        console.log(`[${currentRequestId}] Request was aborted or component unmounted, skipping error handling`);
        return;
      }
      
      const errorMessage = handleCollectionPointError(err, "Erro ao carregar pontos de coleta");
      
      if (isMountedRef.current) {
        setLoadingState(prev => ({
          ...prev,
          isLoading: false,
          isFirstLoad: false,
          hasError: true,
          errorMessage
        }));
      }
    }
  }, [getCollectionPointsUseCase]);

  return {
    collectionPoints,
    loading: loadingState.isLoading,
    isFirstLoad: loadingState.isFirstLoad,
    hasError: loadingState.hasError,
    errorMessage: loadingState.errorMessage,
    loadCollectionPoints,
    filtersRef,
    abortControllerRef
  };
}
