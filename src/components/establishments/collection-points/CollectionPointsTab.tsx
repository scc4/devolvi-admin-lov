
import { useState } from "react";
import { useCollectionPoints } from "@/hooks/useCollectionPoints";
import { CollectionPointsTable } from "./CollectionPointsTable";
import { CollectionPointFormDialog } from "./CollectionPointFormDialog";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";

interface CollectionPointsTabProps {
  establishmentId: string;
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
    isLoading,
    createCollectionPoint,
    updateCollectionPoint,
    deleteCollectionPoint,
    isCreating,
    isUpdating,
  } = useCollectionPoints(carrierContext?.carrierId ? undefined : establishmentId);

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | undefined>(undefined);
  
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
    if (selectedPoint) {
      await updateCollectionPoint(point);
    } else {
      await createCollectionPoint({
        ...point,
        // Default carrier_id if available from context
        carrier_id: carrierContext?.carrierId || point.carrier_id || '',
      });
    }
    setFormDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pontos de Coleta</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button size="sm" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Ponto de Coleta
          </Button>
        </div>
      </div>

      <CollectionPointsTable
        collectionPoints={collectionPoints}
        isLoading={isLoading}
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
