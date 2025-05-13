
import { useCarriers } from "@/hooks/useCarriers";
import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CollectionPoint } from "@/types/collection-point";
import { CollectionPointMobileView } from "./components/CollectionPointMobileView";
import { CollectionPointDesktopView } from "./components/CollectionPointDesktopView";

interface CollectionPointsTableProps {
  collectionPoints: CollectionPoint[];
  isLoading?: boolean;
  onEdit?: (point: CollectionPoint) => void;
  onDelete?: (pointId: string) => void;
  onAssignCarrier?: (pointId: string, carrierId: string | null) => Promise<void>;
  onAction?: (point: CollectionPoint) => void;  // Added for association/disassociation
  actionLabel?: string;  // Added for association/disassociation
  onAssociate?: (point: CollectionPoint) => void;
  onDisassociate?: (point: CollectionPoint) => void;
  showAssociateButton?: boolean;
  showDisassociateButton?: boolean;
}

export function CollectionPointsTable({ 
  collectionPoints,
  isLoading = false,
  onEdit,
  onDelete,
  onAssignCarrier,
  onAction,
  actionLabel,
  onAssociate,
  onDisassociate,
  showAssociateButton,
  showDisassociateButton
}: CollectionPointsTableProps) {
  const { carriers } = useCarriers();
  const { isMobile } = useIsMobile();
  
  const carrierMap = useMemo(() => {
    return new Map(carriers.map(carrier => [carrier.id, carrier]));
  }, [carriers]);
  
  const getSimpleAddress = (point: CollectionPoint) => {
    const parts = [];
    if (point.street) parts.push(point.street);
    if (point.number) parts.push(point.number);
    return parts.length > 0 ? parts.join(', ') : 'Não informado';
  };

  const getLocation = (point: CollectionPoint) => {
    const parts = [];
    if (point.city) parts.push(point.city);
    if (point.state) parts.push(point.state);
    return parts.length > 0 ? parts.join('/') : 'Não informado';
  };

  // If we're showing association buttons, use the existing card layout
  if (showAssociateButton || showDisassociateButton || actionLabel) {
    return (
      <div className="space-y-4">
        {collectionPoints.map((point) => (
          <div key={point.id} className="bg-white p-4 rounded-lg shadow border">
            {point.establishment_id && (
              <h2 className="text-lg font-semibold mb-3 text-primary">
                {point.establishment?.name || 'Estabelecimento não definido'}
              </h2>
            )}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-semibold">{point.name}</h3>
                <p className="text-sm text-gray-600">{getSimpleAddress(point)}</p>
                <p className="text-xs text-gray-500">{getLocation(point)}</p>
                <div className="text-xs text-gray-500 space-y-0.5">
                  {point.district && <p><strong>Bairro:</strong> {point.district}</p>}
                  {point.establishment_id && (
                    <p>
                      <strong>Estabelecimento:</strong> {point.establishment?.name || 'Não definido'}
                    </p>
                  )}
                </div>
              </div>
              {(showAssociateButton || (actionLabel && onAction)) && (
                <button
                  onClick={() => (onAssociate ? onAssociate(point) : onAction && onAction(point))}
                  className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors"
                >
                  {actionLabel || "Associar"}
                </button>
              )}
              {(showDisassociateButton || (actionLabel === "Desassociar" && onAction)) && (
                <button
                  onClick={() => (onDisassociate ? onDisassociate(point) : onAction && onAction(point))}
                  className="bg-destructive text-white px-3 py-1 rounded text-sm hover:bg-destructive/90 transition-colors"
                >
                  {actionLabel || "Desassociar"}
                </button>
              )}
            </div>
          </div>
        ))}
        
        {collectionPoints.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {(showAssociateButton || actionLabel === "Associar")
              ? "Não há pontos de coleta disponíveis para associação"
              : "Não há pontos de coleta associados"
            }
          </div>
        )}
      </div>
    );
  }

  // Render either mobile or desktop view based on screen size
  return isMobile ? (
    <CollectionPointMobileView
      collectionPoints={collectionPoints}
      isLoading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
      carrierMap={carrierMap}
    />
  ) : (
    <CollectionPointDesktopView
      collectionPoints={collectionPoints}
      isLoading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
      onAssignCarrier={onAssignCarrier}
      carrierMap={carrierMap}
    />
  );
}
