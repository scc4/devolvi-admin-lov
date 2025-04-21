
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CollectionPointsTab } from "./CollectionPointsTab";
import type { EstablishmentWithDetails } from "@/types/establishment";

interface ManageCollectionPointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  establishment: EstablishmentWithDetails;
}

export function ManageCollectionPointsDialog({
  open,
  onOpenChange,
  establishment
}: ManageCollectionPointsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Pontos de Coleta - {establishment.name}</DialogTitle>
        </DialogHeader>
        <CollectionPointsTab
          establishmentId={establishment.id}
          carrierContext={{ carrierId: establishment.carrier_id || undefined }}
        />
      </DialogContent>
    </Dialog>
  );
}
