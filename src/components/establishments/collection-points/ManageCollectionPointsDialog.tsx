
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionPointAssociationTab } from "./CollectionPointAssociationTab";
import { CollectionPointsTab } from "./CollectionPointsTab";
import type { Carrier } from "@/types/carrier";
import type { Establishment } from "@/types/establishment";

interface ManageCollectionPointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  establishment?: Establishment;
  carrier?: Carrier;
}

export function ManageCollectionPointsDialog({
  open,
  onOpenChange,
  establishment,
  carrier
}: ManageCollectionPointsDialogProps) {
  const [activeTab, setActiveTab] = useState("collection-points");
  
  // Determine dialog type and content
  const isCarrierDialog = !!carrier?.id;
  const isEstablishmentDialog = !!establishment?.id;
  
  // Generate title based on context
  const title = isCarrierDialog 
    ? `Pontos de Coleta - ${carrier.name}`
    : isEstablishmentDialog 
      ? `Pontos de Coleta - ${establishment.name}`
      : "Pontos de Coleta";
  
  const description = isCarrierDialog
    ? "Gerencie os pontos de coleta associados a esta transportadora."
    : "Gerencie os pontos de coleta.";

  // Reset tab when dialog opens/closes or dialog type changes
  useEffect(() => {
    if (isCarrierDialog) {
      setActiveTab("associated");
    } else if (isEstablishmentDialog) {
      setActiveTab("collection-points");
    }
  }, [isCarrierDialog, isEstablishmentDialog, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogTitle className="text-lg font-semibold leading-none tracking-tight">{title}</DialogTitle>
        <p className="text-sm text-muted-foreground">{description}</p>

        <div className="flex-1 overflow-auto pt-4">
          {isCarrierDialog && carrier?.id && (
            <Tabs defaultValue="associated" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="associated">Pontos Associados</TabsTrigger>
                <TabsTrigger value="available">Pontos Disponíveis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="associated" className="space-y-4">
                <CollectionPointsTab carrierId={carrier.id} />
              </TabsContent>
              
              <TabsContent value="available" className="space-y-4">
                <CollectionPointAssociationTab carrierId={carrier.id} skipCarrierHeader={true} initialTab="unassigned" />
              </TabsContent>
            </Tabs>
          )}

          {isEstablishmentDialog && establishment?.id && (
            <Tabs defaultValue="collection-points" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="collection-points">Pontos de Coleta</TabsTrigger>
                <TabsTrigger value="association">Associação</TabsTrigger>
              </TabsList>
              
              <TabsContent value="collection-points" className="space-y-4">
                <CollectionPointsTab establishmentId={establishment.id} />
              </TabsContent>
              
              <TabsContent value="association" className="space-y-4">
                <CollectionPointAssociationTab establishmentId={establishment.id} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
