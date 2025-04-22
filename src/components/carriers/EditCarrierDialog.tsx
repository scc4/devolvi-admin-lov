
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Carrier } from "@/types/carrier";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServedCitiesTab } from "./ServedCitiesTab";
import { BasicInfoTab } from "./edit-dialog/BasicInfoTab";
import { useDialogHandlers } from "./edit-dialog/useDialogHandlers";

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
  useDialogHandlers({ isSubmitting, onClose });

  return (
    <Dialog open onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{carrier.id ? 'Editar' : 'Nova'} Transportadora</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-2">
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
