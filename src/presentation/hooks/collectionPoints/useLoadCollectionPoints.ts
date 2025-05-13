
import { useState, useCallback, useRef } from 'react';
import { toast } from "sonner";
import { collectionPointAdapter } from '../../../adapters/collectionPoints/collectionPointAdapter';
import { CollectionPoint as CollectionPointUI } from '../../../types/collection-point';
import { handleCollectionPointError, isRequestAborted } from './utils';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use refs para evitar loops infinitos
  const isFirstLoad = useRef(true);
  const filtersRef = useRef(filters);
  const loadingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadCollectionPoints = useCallback(async () => {
    // Prevenir requisições concorrentes
    if (loadingRef.current) {
      // Cancelar requisição anterior
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
    
    // Criar novo controlador de aborto para esta requisição
    abortControllerRef.current = new AbortController();
    
    // Marcar como carregando
    setLoading(true);
    loadingRef.current = true;
    setError(null);
    
    try {
      console.log("Loading collection points with filters:", filtersRef.current);
      const collectionPointDTOs = await getCollectionPointsUseCase.execute(filtersRef.current);
      
      // Verificar se requisição foi abortada
      if (isRequestAborted(abortControllerRef.current)) {
        console.log("Request was aborted, skipping state update");
        return;
      }
      
      console.log("Collection points loaded:", collectionPointDTOs);
      
      if (!collectionPointDTOs || collectionPointDTOs.length === 0) {
        console.log("No collection points found");
      }
      
      const uiModels = collectionPointAdapter.toUIModelList(collectionPointDTOs);
      console.log("Collection points UI models:", uiModels);
      
      setCollectionPoints(uiModels);
    } catch (err) {
      // Pular tratamento de erro se requisição foi abortada
      if (isRequestAborted(abortControllerRef.current)) {
        console.log("Request was aborted, skipping error handling");
        return;
      }
      
      const errorMessage = handleCollectionPointError(err, "Erro ao carregar pontos de coleta");
      setError(errorMessage);
    } finally {
      // Só atualizar estado de carregamento se requisição não foi abortada
      if (!isRequestAborted(abortControllerRef.current)) {
        setLoading(false);
        loadingRef.current = false;
      }
    }
  }, [getCollectionPointsUseCase]); 

  return {
    collectionPoints,
    loading,
    error,
    loadCollectionPoints,
    isFirstLoad,
    filtersRef,
    abortControllerRef
  };
}
