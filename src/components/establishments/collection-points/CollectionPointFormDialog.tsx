
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
import { useEffect } from "react";

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

  const handleSubmit = async () => {
    // Enhanced validation with detailed errors
    const errors = [];
    
    if (!form.name?.trim()) {
      errors.push("Nome");
    }
    
    if (!form.address?.trim()) {
      errors.push("Endereço");
    }
    
    if (errors.length > 0) {
      toast.error(`Por favor, preencha os campos obrigatórios: ${errors.join(', ')}`);
      return;
    }
    
    try {
      await onSubmit(form);
    } catch (error) {
      console.error("Erro ao salvar ponto de coleta:", error);
    }
  };

  // Ensure proper cleanup when dialog is closed
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[1200px] h-[95vh] max-h-[95vh] flex flex-col overflow-hidden p-4 sm:p-6">
        <DialogHeader className="mb-2">
          <DialogTitle>{initialData ? 'Editar' : 'Cadastrar'} Ponto de Coleta</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3 mb-2">
            <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
            <TabsTrigger value="hours">Horário de Funcionamento</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="basic" className="h-full space-y-4 py-4 px-1">
              <BasicInfoTab
                form={form}
                onInputChange={handleInputChange}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="address" className="h-full space-y-4 py-4 px-1">
              <AddressTab
                form={form}
                onInputChange={handleInputChange}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="hours" className="h-full space-y-6 py-4 px-1">
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

        <DialogFooter className="mt-4 pt-2 border-t">
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
