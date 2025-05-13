
import { useCollectionPointCasesWithDI } from './collectionPoints/useCollectionPointCasesWithDI';

/**
 * Hook para casos de uso de pontos de coleta
 * Reexporta a implementação com DI para manter compatibilidade
 */
export function useCollectionPointCases(filters?: {
  establishmentId?: string;
  carrierId?: string;
  unassigned?: boolean;
  cityFilter?: string;
}) {
  return useCollectionPointCasesWithDI(filters);
}
