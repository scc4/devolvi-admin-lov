
import { useState } from "react";
import { useCollectionPointsQuery } from "@/hooks/useCollectionPointsQuery";
import { CollectionPointsTable } from "./CollectionPointsTable";
import { CollectionPointFormDialog } from "./CollectionPointFormDialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, RefreshCcw } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CollectionPointsTabProps {
  establishmentId?: string;
  carrierId?: string;
  carrierContext?: {
    carrierId?: string;
  };
}

export function CollectionPointsTab({
  establishmentId,
  carrierId,
  carrierContext
}: CollectionPointsTabProps) {
  const effectiveCarrierId = carrierId || carrierContext?.carrierId;
  
  const {
    collectionPoints,
    loading,
    error,
    refetch,
    createCollectionPoint,
    updateCollectionPoint,
    deleteCollectionPoint,
    isCreating,
    isUpdating
  } = useCollectionPointsQuery({
    establishmentId,
    carrierId: effectiveCarrierId
  });

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<CollectionPoint | undefined>(undefined);
  const { isMobile } = useIsMobile();
  const [showError, setShowError] = useState(Boolean(error));
  
  // Check if we're in carrier context - if so, disable editing/creating
  const isCarrierContext = Boolean(effectiveCarrierId);
  
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
        await updateCollectionPoint({
          ...selectedPoint,
          ...point
        });
      } else {
        await createCollectionPoint({
          ...point,
          establishment_id: establishmentId || null,
          carrier_id: effectiveCarrierId || null,
        });
      }
      setFormDialogOpen(false);
    } catch (error) {
      console.error("Erro ao enviar ponto de coleta:", error);
    }
  };

  // Lidar com nova tentativa quando ocorre erro
  const handleRetry = () => {
    setShowError(false);
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {isCarrierContext ? "Pontos de Coleta Associados" : "Pontos de Coleta"}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {!isMobile && <span className="ml-2">Atualizar</span>}
          </Button>
          {!isCarrierContext && (
            <Button 
              size="sm" 
              onClick={handleOpenCreate} 
              aria-label="Novo Ponto de Coleta"
              disabled={loading}
            >
              <Plus className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Novo Ponto de Coleta</span>}
            </Button>
          )}
        </div>
      </div>

      {showError && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry}
              className="ml-2"
            >
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <CollectionPointsTable
        collectionPoints={collectionPoints}
        isLoading={loading}
        onEdit={!isCarrierContext ? handleOpenEdit : undefined}
        onDelete={!isCarrierContext ? handleConfirmDelete : undefined}
      />

      {!isCarrierContext && (
        <CollectionPointFormDialog
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          onSubmit={handleFormSubmit}
          initialData={selectedPoint}
          isLoading={isCreating || isUpdating}
          carrierContext={carrierContext}
        />
      )}
    </div>
  );
}
