
import { CollectionPointMobileCard } from "./CollectionPointMobileCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { CollectionPoint } from "@/types/collection-point";

interface CollectionPointMobileViewProps {
  collectionPoints: CollectionPoint[];
  isLoading?: boolean;
  onEdit?: (point: CollectionPoint) => void;
  onDelete?: (pointId: string) => void;
  carrierMap?: Map<string, any>;
}

export function CollectionPointMobileView({
  collectionPoints,
  isLoading,
  onEdit,
  onDelete,
  carrierMap
}: CollectionPointMobileViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-36 w-full" />
        ))}
      </div>
    );
  }

  if (collectionPoints.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum ponto de coleta encontrado
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {collectionPoints.map((point) => (
        <CollectionPointMobileCard
          key={point.id}
          point={point}
          onEdit={() => onEdit?.(point)}
          onDelete={() => onDelete?.(point.id)}
          carrierName={point.carrier_id && carrierMap ? carrierMap.get(point.carrier_id)?.name : undefined}
        />
      ))}
    </div>
  );
}
