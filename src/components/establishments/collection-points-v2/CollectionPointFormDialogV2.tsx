
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoTabV2 } from "./tabs/BasicInfoTabV2";
import { AddressTabV2 } from "./tabs/AddressTabV2";
import { OperatingHoursTabV2 } from "./tabs/OperatingHoursTabV2";
import { useState } from "react";
import { useCollectionPointFormV2 } from "@/hooks/useCollectionPointFormV2";
import { Button } from "@/components/ui/button";
import type { CollectionPoint } from "@/types/collection-point";

interface CollectionPointFormDialogV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<CollectionPoint>) => Promise<void>;
  initialData?: CollectionPoint;
  isLoading?: boolean;
  carrierContext?: {
    carrierId?: string;
  };
  pudoMode?: boolean;
}

export function CollectionPointFormDialogV2({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading,
  carrierContext,
  pudoMode = false
}: CollectionPointFormDialogV2Props) {
  const [activeTab, setActiveTab] = useState("basic");
  const {
    form,
    handleInputChange,
    handleAddressInputChange,
    handleTimeChange,
    addTimePeriod,
    removeTimePeriod
  } = useCollectionPointFormV2(initialData, carrierContext);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Ensure PUDO flag is set if in PUDO mode
      const dataToSubmit = {
        ...form,
        pudo: pudoMode ? true : form.pudo
      };
      
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar" : "Novo"} Ponto {pudoMode ? "PUDO" : "de Coleta"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
              <TabsTrigger value="address">Endereço</TabsTrigger>
              <TabsTrigger value="hours">Horário de Funcionamento</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <BasicInfoTabV2 
                formState={form} 
                updateFormField={handleInputChange}
                pudoMode={pudoMode}
              />
            </TabsContent>
            
            <TabsContent value="address" className="space-y-4 pt-4">
              <AddressTabV2 
                form={form} 
                onInputChange={handleAddressInputChange} 
              />
            </TabsContent>
            
            <TabsContent value="hours" className="space-y-4 pt-4">
              <OperatingHoursTabV2 
                form={form} 
                onTimeChange={handleTimeChange}
                onAddTimePeriod={addTimePeriod}
                onRemoveTimePeriod={removeTimePeriod}
              />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
