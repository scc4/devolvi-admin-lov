
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionPointsTab } from "./CollectionPointsTab";
import { CollectionPointAssociationTab } from "./CollectionPointAssociationTab";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import type { Carrier } from "@/types/carrier";

interface ManageCollectionPointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carrier?: Carrier;
  establishmentId?: string;
  establishmentName?: string;
}

export function ManageCollectionPointsDialog({
  open,
  onOpenChange,
  carrier,
  establishmentId,
  establishmentName
}: ManageCollectionPointsDialogProps) {
  const { isMobile } = useBreakpoint("md");

  // Determine what kind of dialog we're showing based on props
  const isCarrierDialog = !!carrier;
  const isEstablishmentDialog = !!establishmentId;
  const title = isCarrierDialog 
    ? `Pontos de Coleta - ${carrier.name}`
    : isEstablishmentDialog 
      ? `Pontos de Coleta - ${establishmentName}`
      : "Pontos de Coleta";
  
  const description = isCarrierDialog
    ? "Gerencie os pontos de coleta associados a esta transportadora."
    : "Gerencie os pontos de coleta.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[85vh] overflow-y-auto" 
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        {isCarrierDialog && (
          <Tabs defaultValue="manage" className="mt-4">
            <TabsList className={`${isMobile ? 'flex flex-col space-y-1 h-auto' : ''}`}>
              <TabsTrigger value="manage" className="flex-1">
                Gerenciar Associações
              </TabsTrigger>
              <TabsTrigger value="carrier" className="flex-1">
                Pontos da Transportadora
              </TabsTrigger>
            </TabsList>
            <TabsContent value="manage" className="pt-4 pb-2">
              <CollectionPointAssociationTab carrierId={carrier.id} />
            </TabsContent>
            <TabsContent value="carrier" className="pt-4 pb-2">
              <CollectionPointsTab 
                carrierContext={{ carrierId: carrier.id }} 
              />
            </TabsContent>
          </Tabs>
        )}

        {isEstablishmentDialog && (
          <div className="pt-4 pb-2">
            <CollectionPointsTab 
              establishmentId={establishmentId}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
