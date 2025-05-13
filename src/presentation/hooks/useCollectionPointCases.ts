
import { useCollectionPointsQuery } from '@/hooks/useCollectionPointsQuery';

/**
 * Hook para casos de uso de pontos de coleta
 * Reexporta a implementação React Query para manter compatibilidade
 */
export function useCollectionPointCases(filters?: {
  establishmentId?: string;
  carrierId?: string;
  unassigned?: boolean;
  cityFilter?: string;
}) {
  return useCollectionPointsQuery(filters);
}
