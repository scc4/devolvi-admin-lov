
import { useState } from "react";
import { useCollectionPointCasesWithDI } from "@/presentation/hooks/useCollectionPointCasesWithDI";
import { CollectionPointsTable } from "./CollectionPointsTable";
import { CollectionPointFormDialog } from "./CollectionPointFormDialog";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import { useIsMobile } from "@/hooks/use-mobile";
import { collectionPointAdapter } from "@/adapters/collectionPoints/collectionPointAdapter";

interface CollectionPointsTabProps {
  establishmentId?: string;
  carrierContext?: {
    carrierId?: string;
  };
}

export function CollectionPointsTab({
  establishmentId,
  carrierContext
}: CollectionPointsTabProps) {
  const {
    collectionPoints,
    loading,
    error,
    loadCollectionPoints: refetch,
    handleCreate: createCollectionPoint,
    handleUpdate: updateCollectionPoint,
    handleDelete: deleteCollectionPoint,
    isCreating,
    isUpdating
  } = useCollectionPointCasesWithDI({
    establishmentId,
    carrierId: carrierContext?.carrierId
  });

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
        // For updates, convert from UI model to DTO before passing to handler
        const pointDTO = collectionPointAdapter.fromUIModel(point);
        await updateCollectionPoint(pointDTO);
      } else {
        // Create new point with appropriate context
        const pointData = {
          ...point,
          establishment_id: establishmentId || null,
          carrier_id: carrierContext?.carrierId || null,
        };
        // Convert from UI model to DTO before passing to handler
        const pointDTO = collectionPointAdapter.fromUIModel(pointData);
        await createCollectionPoint(pointDTO);
      }
      setFormDialogOpen(false);
    } catch (error) {
      console.error("Error submitting collection point:", error);
    }
  };

  // Convert DDD collection points to UI format if needed
  const formattedCollectionPoints = collectionPoints.map(
    point => collectionPointAdapter.toUIModel ? 
      collectionPointAdapter.toUIModel(point) : 
      point as unknown as CollectionPoint
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pontos de Coleta</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Atualizar</span>}
          </Button>
          <Button size="sm" onClick={handleOpenCreate} aria-label="Novo Ponto de Coleta">
            <Plus className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Novo Ponto de Coleta</span>}
          </Button>
        </div>
      </div>

      <CollectionPointsTable
        collectionPoints={formattedCollectionPoints}
        isLoading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleConfirmDelete}
      />

      <CollectionPointFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedPoint}
        isLoading={isCreating || isUpdating}
        carrierContext={carrierContext}
      />
    </div>
  );
}
