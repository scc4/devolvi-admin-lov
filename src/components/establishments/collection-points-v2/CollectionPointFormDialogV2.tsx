
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTabV2 } from "./tabs/BasicInfoTabV2";
import { AddressTabV2 } from "./tabs/AddressTabV2";
import { OperatingHoursTabV2 } from "./tabs/OperatingHoursTabV2";
import { toast } from "sonner";
import type { CollectionPoint, Address } from "@/types/collection-point";
import { useDialogCleanup } from "@/hooks/useDialogCleanup";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCollectionPointFormV2 } from "@/hooks/useCollectionPointFormV2";

interface CollectionPointFormDialogV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (point: Partial<CollectionPoint>) => Promise<void>;
  initialData?: CollectionPoint;
  isLoading?: boolean;
  carrierContext?: {
    carrierId?: string;
  };
}

export function CollectionPointFormDialogV2({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
  carrierContext
}: CollectionPointFormDialogV2Props) {
  const {
    form,
    handleInputChange,
    handleAddressInputChange,
    handleTimeChange,
    addTimePeriod,
    removeTimePeriod,
  } = useCollectionPointFormV2(initialData, carrierContext);
  
  const [activeTab, setActiveTab] = useState("basic");
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const { isMobile } = useIsMobile();

  // Use our custom cleanup hook
  useDialogCleanup({ open });
  
  // Reset errors and active tab when dialog is closed or opened
  useEffect(() => {
    if (open) {
      setPhoneError(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    const errors = [];
    setPhoneError(null);
    
    if (!form.name?.trim()) {
      errors.push("Nome");
    }

    if (errors.length > 0) {
      toast.error(`Por favor, preencha os campos obrigatórios: ${errors.join(', ')}`);
      return;
    }
    
    try {
      await onSubmit({ ...form });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erro ao salvar ponto de coleta:", error);
      
      // Verificar se é um erro de telefone duplicado
      if (error?.message?.includes('duplicate key') && error?.message?.includes('collection_points_phone_unique')) {
        setPhoneError("Este número de telefone já está em uso por outro ponto de coleta");
        setActiveTab("basic");
        toast.error("Número de telefone já cadastrado em outro ponto de coleta");
      } else {
        toast.error("Erro ao salvar ponto de coleta");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[1200px] h-[90vh] max-h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>{initialData ? 'Editar' : 'Cadastrar'} Ponto de Coleta</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden p-6 pt-4 flex flex-col">
          <Tabs 
            defaultValue="basic" 
            className="flex-1 flex flex-col overflow-hidden"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className={`grid w-full ${isMobile ? "grid-cols-1 gap-1" : "grid-cols-3"} mb-4`}>
              <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
              <TabsTrigger value="address">Endereço</TabsTrigger>
              <TabsTrigger value="hours">Horário de Funcionamento</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <TabsContent value="basic" className="mt-0 h-full">
                <BasicInfoTabV2
                  form={form}
                  onInputChange={handleInputChange}
                  isLoading={isLoading}
                  phoneError={phoneError}
                />
              </TabsContent>

              <TabsContent value="address" className="mt-0 h-full">
                <AddressTabV2
                  form={form}
                  onInputChange={handleAddressInputChange}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="hours" className="mt-0 h-full">
                <OperatingHoursTabV2
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
