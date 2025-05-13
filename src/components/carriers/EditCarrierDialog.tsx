
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Carrier } from "@/types/carrier";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServedCitiesTab } from "./ServedCitiesTab";
import { BasicInfoTab } from "./edit-dialog/BasicInfoTab";
import { useDialogCleanup } from "@/hooks/useDialogCleanup";
import { useIsMobile } from "@/hooks/use-mobile";

interface EditCarrierDialogProps {
  carrier: Carrier;
  onClose: () => void;
  onSave?: (carrier: Carrier) => Promise<void>;
  onEdit?: (carrier: Carrier) => Promise<void>;
  isSubmitting?: boolean;
  open?: boolean;
}

export function EditCarrierDialog({
  carrier,
  onClose,
  onSave,
  onEdit,
  isSubmitting = false,
  open = true
}: EditCarrierDialogProps) {
  const { isMobile } = useIsMobile();
  
  // Use our custom cleanup hook instead of the old handler
  useDialogCleanup({ open }); 

  const handleSave = async (carrierData: Carrier) => {
    if (onSave) {
      await onSave(carrierData);
    } else if (onEdit) {
      await onEdit(carrierData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{carrier.id ? 'Editar' : 'Nova'} Transportadora</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className={`grid w-full ${isMobile ? "grid-cols-1 gap-1" : "grid-cols-2"}`}>
            <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
            <TabsTrigger value="cities">
              Cidades Atendidas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoTab
              carrier={carrier}
              onSave={handleSave}
              onClose={onClose}
              isSubmitting={isSubmitting}
            />
          </TabsContent>

          <TabsContent value="cities">
            <ServedCitiesTab 
              carrierId={carrier.id} 
              isSubmitting={isSubmitting}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
