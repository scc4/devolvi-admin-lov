
import { useState } from "react";
import { useCollectionPointsV2 } from "@/hooks/useCollectionPointsV2";
import { CollectionPointsTableV2 } from "./CollectionPointsTableV2";
import { CollectionPointFormDialogV2 } from "./CollectionPointFormDialogV2";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import { useIsMobile } from "@/hooks/use-mobile";

interface CollectionPointsTabV2Props {
  establishmentId?: string;
  carrierContext?: {
    carrierId?: string;
  };
  initialFilter?: {
    establishment_id?: string;
  };
  pudoOnly?: boolean;
}

export function CollectionPointsTabV2({ 
  establishmentId,
  carrierContext,
  initialFilter,
  pudoOnly = false
}: CollectionPointsTabV2Props) {
  const filteredEstablishmentId = initialFilter?.establishment_id || establishmentId;
  
  const {
    collectionPoints: allCollectionPoints,
    isLoading,
    createCollectionPoint,
    updateCollectionPoint,
    deleteCollectionPoint,
    isCreating,
    isUpdating,
    refetch
  } = useCollectionPointsV2(
    filteredEstablishmentId, 
    carrierContext?.carrierId
  );
  
  // Apply PUDO filter if needed
  const collectionPoints = pudoOnly 
    ? allCollectionPoints.filter(point => point.pudo === true)
    : allCollectionPoints;

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | undefined>(undefined);
  const { isMobile } = useIsMobile();
  
  const handleOpenCreate = () => {
    setSelectedPoint(undefined);
    setFormDialogOpen(true);
  };
  
  const handleOpenEdit = (point: CollectionPoint) => {
    setSelectedPoint(point);
    setFormDialogOpen(true);
  };
  
  const handleConfirmDelete = async (pointId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este ponto de coleta?')) {
      await deleteCollectionPoint(pointId);
    }
  };
  
  const handleFormSubmit = async (point: Partial<CollectionPoint>) => {
    try {
      if (selectedPoint) {
        await updateCollectionPoint(point);
      } else {
        // Create new point with appropriate context
        const pointData = {
          ...point,
          establishment_id: filteredEstablishmentId || null,
          carrier_id: carrierContext?.carrierId || null,
          // Set PUDO flag if in PUDO mode
          pudo: pudoOnly ? true : point.pudo
        };
        await createCollectionPoint(pointData);
      }
      setFormDialogOpen(false);
    } catch (error) {
      console.error("Error submitting collection point:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pontos de Coleta{pudoOnly ? " PUDO" : ""}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Atualizar</span>}
          </Button>
          <Button size="sm" onClick={handleOpenCreate} aria-label="Novo Ponto de Coleta">
            <Plus className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Novo {pudoOnly ? "PUDO" : "Ponto de Coleta"}</span>}
          </Button>
        </div>
      </div>

      <CollectionPointsTableV2
        collectionPoints={collectionPoints}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleConfirmDelete}
      />

      <CollectionPointFormDialogV2
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedPoint}
        isLoading={isCreating || isUpdating}
        carrierContext={carrierContext}
        pudoMode={pudoOnly}
      />
    </div>
  );
}
