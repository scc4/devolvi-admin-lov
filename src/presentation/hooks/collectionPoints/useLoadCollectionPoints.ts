
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from "sonner";
import { collectionPointAdapter } from '../../../adapters/collectionPoints/collectionPointAdapter';
import { CollectionPoint as CollectionPointUI } from '../../../types/collection-point';
import { handleCollectionPointError, isRequestAborted } from './utils';

/**
 * Hook simplificado para carregamento de pontos de coleta
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
  // Estados unificados para melhor gerenciamento
  const [state, setState] = useState({
    collectionPoints: [] as CollectionPointUI[],
    loading: true,
    error: null as string | null,
    isFirstLoad: true
  });
  
  // Refs necessários para controle do ciclo de vida
  const isMountedRef = useRef<boolean>(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const filtersRef = useRef(filters);
  
  // Atualiza a ref de filtros quando os filtros mudam
  useEffect(() => {
    filtersRef.current = filters;
    console.log("Filtros atualizados:", filters);
  }, [filters]);
  
  // Limpa recursos ao desmontar o componente
  useEffect(() => {
    return () => {
      console.log("Hook useLoadCollectionPoints desmontando");
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const loadCollectionPoints = useCallback(async (forceRefresh = false) => {
    // Skip if component is unmounted
    if (!isMountedRef.current) {
      console.log("loadCollectionPoints skipped - component não está montado");
      return;
    }
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create a new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    console.log(`Loading collection points with filters:`, filtersRef.current, 
      forceRefresh ? "(forçando atualização)" : "");
    
    // Set loading state
    setState(prev => ({
      ...prev,
      loading: true,
      error: null
    }));
    
    try {
      // Execute use case to load data
      const collectionPointDTOs = await getCollectionPointsUseCase.execute(filtersRef.current);
      
      // Skip updating state if component unmounted or request was aborted
      if (!isMountedRef.current || isRequestAborted(abortControllerRef.current)) {
        console.log("Request outdated or component unmounted, ignorando resposta");
        return;
      }
      
      console.log("Collection points carregados:", collectionPointDTOs?.length || 0);
      
      // Convert to UI models
      const uiModels = collectionPointDTOs ? collectionPointAdapter.toUIModelList(collectionPointDTOs) : [];
      console.log("Collection points UI models:", uiModels.length);
      
      // Update state if component is still mounted
      if (isMountedRef.current) {
        setState({
          collectionPoints: uiModels,
          loading: false,
          error: null,
          isFirstLoad: false
        });
      }
    } catch (err) {
      // Skip error handling if request was aborted or component unmounted
      if (isRequestAborted(abortControllerRef.current) || !isMountedRef.current) {
        console.log("Request aborted or component unmounted, pulando tratamento de erro");
        return;
      }
      
      const errorMessage = handleCollectionPointError(err, "Erro ao carregar pontos de coleta");
      
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          loading: false,
          isFirstLoad: false,
          error: errorMessage
        }));
      }
    }
  }, [getCollectionPointsUseCase]);

  return {
    ...state,
    loadCollectionPoints,
    filtersRef,
    abortControllerRef
  };
}
