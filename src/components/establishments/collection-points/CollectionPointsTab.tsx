
import { useState, useEffect } from "react";
import { useCollectionPointCasesWithDI } from "@/presentation/hooks/collectionPoints/useCollectionPointCasesWithDI";
import { CollectionPointsTable } from "./CollectionPointsTable";
import { CollectionPointFormDialog } from "./CollectionPointFormDialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Plus, RefreshCcw } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import { useIsMobile } from "@/hooks/use-mobile";
import { collectionPointAdapter } from "@/adapters/collectionPoints/collectionPointAdapter";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  console.log("CollectionPointsTab rendered with:", { 
    establishmentId, 
    carrierId: carrierContext?.carrierId,
    timestamp: new Date().toISOString()
  });
  
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
  const [showError, setShowError] = useState(false);
  
  // Reset error state when filters change
  useEffect(() => {
    setShowError(false);
  }, [establishmentId, carrierContext]);
  
  // Show error after loading finishes if there is an error
  useEffect(() => {
    if (!loading && error) {
      setShowError(true);
    }
  }, [loading, error]);
  
  // Force data load on component mount and when context changes
  useEffect(() => {
    console.log("CollectionPointsTab context changed - forcing refresh", {
      carrierId: carrierContext?.carrierId,
      establishmentId
    });
    
    // Force a refresh when the component is mounted or context changes
    refetch(true);
  }, [carrierContext?.carrierId, establishmentId, refetch]);
  
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
        const pointDTO = collectionPointAdapter.fromUIModel({
          ...selectedPoint,
          ...point
        });
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

  // Handle retry when error occurs
  const handleRetry = () => {
    setShowError(false);
    refetch(true); // Force refresh
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pontos de Coleta</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch(true)}
            disabled={loading}
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {!isMobile && <span className="ml-2">Atualizar</span>}
          </Button>
          <Button 
            size="sm" 
            onClick={handleOpenCreate} 
            aria-label="Novo Ponto de Coleta"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Novo Ponto de Coleta</span>}
          </Button>
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
        onEdit={handleOpenEdit}
        onDelete={handleConfirmDelete}
        key={`points-table-${establishmentId || carrierContext?.carrierId || 'all'}-${Date.now()}`}
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
