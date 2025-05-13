
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionPointsTab } from "./CollectionPointsTab";
import { CollectionPointAssociationTab } from "./CollectionPointAssociationTab";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import type { Carrier } from "@/types/carrier";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useEffect, useState } from "react";

interface ManageCollectionPointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carrier?: Carrier;
  establishmentId?: string;
  establishmentName?: string;
}

export function ManageCollectionPointsDialog({
  open,
  onOpenChange,
  carrier,
  establishmentId,
  establishmentName
}: ManageCollectionPointsDialogProps) {
  const { isMobile } = useBreakpoint("md");
  const [isReady, setIsReady] = useState(false);
  
  // Contexto simples para controle de diálogo
  const isCarrierDialog = Boolean(carrier?.id);
  const title = isCarrierDialog 
    ? `Pontos de Coleta - ${carrier?.name}`
    : establishmentId 
      ? `Pontos de Coleta - ${establishmentName || establishmentId}`
      : "Pontos de Coleta";
      
  const description = isCarrierDialog
    ? "Gerencie os pontos de coleta associados a esta transportadora."
    : "Gerencie os pontos de coleta.";
  
  // Diagnóstico de propriedades
  console.log("ManageCollectionPointsDialog props:", {
    open,
    carrier,
    establishmentId,
    isCarrierDialog,
    isReady
  });
  
  // Garantir que o conteúdo só seja renderizado após o diálogo estar aberto
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [open]);

  // Gerar uma chave estável baseada na entidade
  const dialogId = isCarrierDialog 
    ? `carrier-dialog-${carrier?.id}` 
    : `establishment-dialog-${establishmentId}`;

  const handleDialogError = (error: any) => {
    console.error("Collection points dialog error:", error);
    onOpenChange(false);
    setTimeout(() => {
      alert("Ocorreu um erro ao carregar os pontos de coleta. Tente novamente.");
    }, 100);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <DialogContent 
        className="max-w-4xl max-h-[85vh] overflow-y-auto" 
        onOpenAutoFocus={(e) => e.preventDefault()}
        id={dialogId}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        {isReady && (
          <ErrorBoundary 
            fallback={<div className="p-4 text-center text-destructive">
              Ocorreu um erro ao carregar os pontos de coleta. 
              <button 
                onClick={() => window.location.reload()}
                className="block mx-auto mt-2 text-sm underline"
              >
                Recarregar página
              </button>
            </div>}
            onError={handleDialogError}
          >
            {isCarrierDialog && carrier?.id && (
              // For carrier context, only show association management
              <div className="pt-4 pb-2">
                <CollectionPointAssociationTab 
                  carrierId={carrier?.id} 
                  skipCarrierHeader={false}
                />
              </div>
            )}

            {establishmentId && (
              <div className="pt-4 pb-2">
                <CollectionPointsTab 
                  establishmentId={establishmentId}
                />
              </div>
            )}
          </ErrorBoundary>
        )}
      </DialogContent>
    </Dialog>
  );
}
