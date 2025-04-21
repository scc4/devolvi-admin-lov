
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { AddressTab } from "./tabs/AddressTab";
import { OperatingHoursTab } from "./tabs/OperatingHoursTab";
import { useCollectionPointForm } from "@/hooks/useCollectionPointForm";
import type { CollectionPoint } from "@/types/collection-point";

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
    if (!form.name || !form.address || (!form.carrier_id && !carrierContext?.carrierId)) {
      alert("Por favor, preencha os campos obrigatórios: Nome, Endereço");
      return;
    }
    
    const pointData = {
      ...form,
      ...(carrierContext?.carrierId && !form.carrier_id ? { carrier_id: carrierContext.carrierId } : {})
    };
    
    await onSubmit(pointData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar' : 'Cadastrar'} Ponto de Coleta</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
            <TabsTrigger value="hours">Horário de Funcionamento</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <BasicInfoTab
              form={form}
              onInputChange={handleInputChange}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="address" className="space-y-4 py-4">
            <AddressTab
              form={form}
              onInputChange={handleInputChange}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="hours" className="space-y-6 py-4">
            <OperatingHoursTab
              form={form}
              onTimeChange={handleTimeChange}
              onAddTimePeriod={addTimePeriod}
              onRemoveTimePeriod={removeTimePeriod}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
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
