
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CollectionPointsTabWithDI } from "./CollectionPointsTabWithDI";
import { CollectionPointAssociationTabWithDI } from "./CollectionPointAssociationTabWithDI";
import type { EstablishmentWithDetails } from "@/types/establishment";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDialogCleanup } from "@/hooks/useDialogCleanup";
import { useState, useEffect } from "react";

interface ManageCollectionPointsDialogWithDIProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  establishment?: EstablishmentWithDetails;
  carrierContext?: {
    carrierId: string;
  };
}

export function ManageCollectionPointsDialogWithDI({
  open,
  onOpenChange,
  establishment,
  carrierContext
}: ManageCollectionPointsDialogWithDIProps) {
  const { isMobile } = useIsMobile();
  const [dialogKey, setDialogKey] = useState<number>(0);
  
  // Use our custom cleanup hook
  useDialogCleanup({ open });

  // Reset the component key when dialog opens to force a clean remount
  useEffect(() => {
    if (open) {
      setDialogKey(prevKey => prevKey + 1);
    }
  }, [open]);

  // Determine title based on context
  const dialogTitle = establishment 
    ? `Pontos de Coleta - ${establishment.name}` 
    : "Associar Pontos de Coleta";

  const Content = () => {
    if (carrierContext?.carrierId) {
      return <CollectionPointAssociationTabWithDI key={`carrier-cp-${dialogKey}`} carrierId={carrierContext.carrierId} />;
    }
    return (
      <CollectionPointsTabWithDI
        key={`establishment-cp-${dialogKey}`}
        establishmentId={establishment?.id}
        carrierContext={carrierContext}
      />
    );
  };

  // Mobile view uses Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] sm:h-[95vh] p-0 pt-6">
          <div className="h-full flex flex-col">
            <SheetHeader className="px-4 pb-2">
              <SheetTitle>{dialogTitle}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-auto px-4 pb-4">
              <Content />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop view uses Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1200px] h-[95vh] max-h-[95vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto p-6 pt-4">
          <Content />
        </div>
      </DialogContent>
    </Dialog>
  );
}
