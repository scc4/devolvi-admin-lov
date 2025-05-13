
import { useState } from "react";
import { useCollectionPointCasesWithDI } from "@/presentation/hooks/collectionPoints/useCollectionPointCasesWithDI";
import { Button } from "@/components/ui/button";
import { CollectionPointsTable } from "./CollectionPointsTable";
import { CollectionPointAssociationHeader } from "./CollectionPointAssociationHeader";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CollectionPoint } from "@/types/collection-point";

interface CollectionPointAssociationTabProps {
  establishmentId?: string;
  carrierId?: string;
  skipCarrierHeader?: boolean;
  initialTab?: string;
}

export function CollectionPointAssociationTab({
  establishmentId,
  carrierId,
  skipCarrierHeader = false,
  initialTab = "unassigned"
}: CollectionPointAssociationTabProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Query for unassigned points
  const {
    collectionPoints: unassignedPoints,
    loading: loadingUnassigned,
    error: unassignedError,
    refetch: refetchUnassigned,
    assignCarrier,
    isAssigningCarrier
  } = useCollectionPointCasesWithDI({
    unassigned: true
  });
  
  // Query for assigned points (if in carrier context)
  const {
    collectionPoints: assignedPoints,
    loading: loadingAssigned,
    error: assignedError,
    refetch: refetchAssigned
  } = useCollectionPointCasesWithDI({
    carrierId
  });

  const handleAssignCarrier = async (point: CollectionPoint) => {
    if (!carrierId) return;
    
    try {
      await assignCarrier({ collectionPointId: point.id, carrierId });
      refetchUnassigned();
      refetchAssigned();
    } catch (error) {
      console.error("Error assigning carrier:", error);
    }
  };

  const handleRemoveCarrier = async (point: CollectionPoint) => {
    try {
      await assignCarrier({ collectionPointId: point.id, carrierId: null });
      refetchUnassigned();
      refetchAssigned();
    } catch (error) {
      console.error("Error removing carrier:", error);
    }
  };

  // Handle errors and retries
  const [showUnassignedError, setShowUnassignedError] = useState(Boolean(unassignedError));
  const [showAssignedError, setShowAssignedError] = useState(Boolean(assignedError));

  // Fixed event handlers to handle button click events
  const handleRetryUnassigned = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowUnassignedError(false);
    refetchUnassigned();
  };

  const handleRetryAssigned = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowAssignedError(false);
    refetchAssigned();
  };

  // Properly wrap the refetch functions to handle click events
  const handleRefreshUnassigned = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    refetchUnassigned();
  };

  const handleRefreshAssigned = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    refetchAssigned();
  };

  return (
    <div className="space-y-4">
      {!skipCarrierHeader && (
        <CollectionPointAssociationHeader 
          carrierId={carrierId}
          establishmentId={establishmentId}
        />
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="unassigned">Pontos Disponíveis</TabsTrigger>
          {carrierId && <TabsTrigger value="assigned">Pontos Associados</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="unassigned" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Pontos de Coleta Disponíveis</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshUnassigned}
              disabled={loadingUnassigned}
            >
              <RefreshCcw className={`h-4 w-4 ${loadingUnassigned ? 'animate-spin' : ''}`} />
              <span className="ml-2">Atualizar</span>
            </Button>
          </div>
          
          {showUnassignedError && unassignedError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex justify-between items-center">
                <span>{unassignedError}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetryUnassigned}
                  className="ml-2"
                >
                  Tentar novamente
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <CollectionPointsTable 
            collectionPoints={unassignedPoints}
            isLoading={loadingUnassigned}
            actionLabel={carrierId ? "Associar" : undefined}
            onAction={carrierId ? handleAssignCarrier : undefined}
            actionDisabled={isAssigningCarrier}
          />
        </TabsContent>
        
        {carrierId && (
          <TabsContent value="assigned" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Pontos de Coleta Associados</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshAssigned}
                disabled={loadingAssigned}
              >
                <RefreshCcw className={`h-4 w-4 ${loadingAssigned ? 'animate-spin' : ''}`} />
                <span className="ml-2">Atualizar</span>
              </Button>
            </div>
            
            {showAssignedError && assignedError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex justify-between items-center">
                  <span>{assignedError}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRetryAssigned}
                    className="ml-2"
                  >
                    Tentar novamente
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <CollectionPointsTable 
              collectionPoints={assignedPoints}
              isLoading={loadingAssigned}
              actionLabel="Remover"
              onAction={handleRemoveCarrier}
              actionDisabled={isAssigningCarrier}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
