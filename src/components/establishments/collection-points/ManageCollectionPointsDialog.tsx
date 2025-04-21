
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CollectionPointsTab } from "./CollectionPointsTab";
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

  // Ensure proper cleanup when dialog/sheet is closed
  useEffect(() => {
    if (!open) {
      // Small timeout to ensure the dialog is fully closed before cleanup
      const timeout = setTimeout(() => {
        document.body.style.pointerEvents = '';
        const overlays = document.querySelectorAll('[data-radix-portal]');
        overlays.forEach(overlay => {
          if (!overlay.contains(document.activeElement)) {
            (overlay as HTMLElement).style.display = 'none';
          }
        });
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [open]);

  // Determine title based on context - safely handle undefined establishment
  const dialogTitle = establishment 
    ? `Pontos de Coleta - ${establishment.name}` 
    : "Pontos de Coleta da Transportadora";

  // Mobile view uses full-screen Sheet
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] sm:h-[95vh]">
          <SheetHeader className="mb-4">
            <SheetTitle>{dialogTitle}</SheetTitle>
          </SheetHeader>
          <CollectionPointsTab
            establishmentId={establishment?.id}
            carrierContext={carrierContext}
          />
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
        <CollectionPointsTab
          establishmentId={establishment?.id}
          carrierContext={carrierContext}
        />
      </DialogContent>
    </Dialog>
  );
}
