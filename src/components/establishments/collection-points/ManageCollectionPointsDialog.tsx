
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CollectionPointsTab } from "./CollectionPointsTab";
import { CollectionPointAssociationTab } from "./CollectionPointAssociationTab";
import type { EstablishmentWithDetails } from "@/types/establishment";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";

interface ManageCollectionPointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  establishment?: EstablishmentWithDetails;
  carrierContext?: {
    carrierId: string;
  };
}

export function ManageCollectionPointsDialog({
  open,
  onOpenChange,
  establishment,
  carrierContext
}: ManageCollectionPointsDialogProps) {
  const { isMobile } = useIsMobile();

  // Enhanced cleanup when dialog/sheet is closed
  useEffect(() => {
    if (!open) {
      // Clean up any lingering portal elements and reset pointer-events
      const cleanup = () => {
        document.body.style.pointerEvents = '';
        const overlays = document.querySelectorAll('[data-radix-portal]');
        overlays.forEach(overlay => {
          if (!overlay.contains(document.activeElement)) {
            (overlay as HTMLElement).style.display = 'none';
          }
        });
      };
      
      // Execute cleanup with a small delay to ensure dialog animations complete
      const timeoutId = setTimeout(cleanup, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

  // Determine title based on context
  const dialogTitle = establishment 
    ? `Pontos de Coleta - ${establishment.name}` 
    : "Associar Pontos de Coleta";

  const Content = () => {
    if (carrierContext?.carrierId) {
      return <CollectionPointAssociationTab carrierId={carrierContext.carrierId} />;
    }
    return (
      <CollectionPointsTab
        establishmentId={establishment?.id}
        carrierContext={carrierContext}
      />
    );
  };

  // Mobile view uses Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] sm:h-[95vh]">
          <SheetHeader className="mb-4">
            <SheetTitle>{dialogTitle}</SheetTitle>
          </SheetHeader>
          <Content />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop view uses Dialog
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}
