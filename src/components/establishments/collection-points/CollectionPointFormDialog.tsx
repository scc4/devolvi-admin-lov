
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { AddressTab } from "./tabs/AddressTab";
import { OperatingHoursTab } from "./tabs/OperatingHoursTab";
import { useCollectionPointForm } from "@/hooks/useCollectionPointForm";
import { toast } from "sonner";
import type { CollectionPoint } from "@/types/collection-point";
import { useDialogCleanup } from "@/hooks/useDialogCleanup";
import { useIsMobile } from "@/hooks/use-mobile";

interface CollectionPointFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (point: Partial<CollectionPoint>) => Promise<void>;
  initialData?: CollectionPoint;
  isLoading?: boolean;
  carrierContext?: {
    carrierId?: string;
  };
}

export function CollectionPointFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
  carrierContext
}: CollectionPointFormDialogProps) {
  const {
    form,
    handleInputChange,
    handleTimeChange,
    addTimePeriod,
    removeTimePeriod,
  } = useCollectionPointForm(initialData, carrierContext);

  const { isMobile } = useIsMobile();

  // Use our custom cleanup hook
  useDialogCleanup({ open });

  const handleSubmit = async () => {
    const errors = [];
    
    if (!form.name?.trim()) {
      errors.push("Nome");
    }

    if (errors.length > 0) {
      toast.error(`Por favor, preencha os campos obrigatórios: ${errors.join(', ')}`);
      return;
    }
    
    try {
      // Remove the explicit address=null setting since we handle it in the hook now
      await onSubmit({ ...form });
    } catch (error) {
      console.error("Erro ao salvar ponto de coleta:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1200px] h-[95vh] max-h-[95vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{initialData ? 'Editar' : 'Cadastrar'} Ponto de Coleta</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden p-6 pt-4 flex flex-col">
          <Tabs defaultValue="basic" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className={`grid w-full ${isMobile ? "grid-cols-1 gap-1" : "grid-cols-3"} mb-4`}>
              <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
              <TabsTrigger value="address">Endereço</TabsTrigger>
              <TabsTrigger value="hours">Horário de Funcionamento</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="basic" className="h-full overflow-auto">
                <BasicInfoTab
                  form={form}
                  onInputChange={handleInputChange}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="address" className="h-full overflow-auto">
                <AddressTab
                  form={form}
                  onInputChange={handleInputChange}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="hours" className="h-full overflow-auto">
                <OperatingHoursTab
                  form={form}
                  onTimeChange={handleTimeChange}
                  onAddTimePeriod={addTimePeriod}
                  onRemoveTimePeriod={removeTimePeriod}
                  isLoading={isLoading}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
