
import type { CollectionPoint } from "@/types/collection-point";
import { useIsMobile } from "@/hooks/use-mobile";
import { CollectionPointMobileCard } from "./CollectionPointMobileCard";
import { CollectionPointDesktopTable } from "./CollectionPointDesktopTable";

interface CollectionPointsTableProps {
  collectionPoints: CollectionPoint[];
  isLoading: boolean;
  onEdit: (point: CollectionPoint) => void;
  onDelete: (pointId: string) => void;
}

export function CollectionPointsTable({
  collectionPoints,
  isLoading,
  onEdit,
  onDelete,
}: CollectionPointsTableProps) {
  const { isMobile } = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (collectionPoints.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md">
        <p className="text-muted-foreground">Nenhum ponto de coleta cadastrado</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {collectionPoints.map((point) => (
          <CollectionPointMobileCard
            key={point.id}
            point={point}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <CollectionPointDesktopTable
      collectionPoints={collectionPoints}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
