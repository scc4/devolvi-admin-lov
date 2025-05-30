
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
  onSave: (carrier: Carrier) => Promise<void>;
  isSubmitting?: boolean;
}

export function EditCarrierDialog({
  carrier,
  onClose,
  onSave,
  isSubmitting = false
}: EditCarrierDialogProps) {
  const { isMobile } = useIsMobile();
  
  // Use our custom cleanup hook instead of the old handler
  useDialogCleanup({ open: true }); // Always open when component is mounted

  return (
    <Dialog open onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{carrier.id ? 'Editar' : 'Nova'} Transportadora</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className={`grid w-full ${isMobile ? "grid-cols-1 gap-1" : "grid-cols-2"}`}>
            <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
            {/* Agora habilitamos a aba de cidades mesmo para novas transportadoras */}
            <TabsTrigger value="cities">
              Cidades Atendidas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <BasicInfoTab
              carrier={carrier}
              onSave={onSave}
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
