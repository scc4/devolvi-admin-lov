
import { useCarriers } from "@/hooks/useCarriers";
import { useState, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CollectionPoint } from "@/types/collection-point";
import { CollectionPointMobileCard } from "./components/CollectionPointMobileCard";
import { CollectionPointDesktopView } from "./components/CollectionPointDesktopView";

interface CollectionPointDesktopTableProps {
  collectionPoints: CollectionPoint[];
  onEdit: (point: CollectionPoint) => void;
  onDelete: (pointId: string) => void;
  onAssignCarrier: (pointId: string, carrierId: string | null) => Promise<void>;
}

export function CollectionPointDesktopTable({
  collectionPoints,
  onEdit,
  onDelete,
  onAssignCarrier,
}: CollectionPointDesktopTableProps) {
  const { carriers } = useCarriers();
  const { isMobile } = useIsMobile();
  
  const carrierMap = useMemo(() => {
    return new Map(carriers.map(carrier => [carrier.id, carrier]));
  }, [carriers]);

  if (isMobile) {
    return (
      <div className="space-y-4">
        {collectionPoints.map((point) => (
          <CollectionPointMobileCard
            key={point.id}
            point={point}
            onEdit={onEdit}
            onDelete={onDelete}
            onAssignCarrier={onAssignCarrier}
            carrierName={carrierMap.get(point.carrier_id)?.name}
          />
        ))}
        
        {collectionPoints.length === 0 && (
          <div className="text-center p-8 border rounded-md bg-background">
            <p className="text-muted-foreground">Nenhum ponto de coleta encontrado</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <CollectionPointDesktopView
      collectionPoints={collectionPoints}
      onEdit={onEdit}
      onDelete={onDelete}
      onAssignCarrier={onAssignCarrier}
      carrierMap={carrierMap}
    />
  );
}
