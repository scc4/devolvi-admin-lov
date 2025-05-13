
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionPointsTab } from "./CollectionPointsTab";
import { CollectionPointAssociationTab } from "./CollectionPointAssociationTab";
import { useBreakpoint } from "@/hooks/use-breakpoint";
import { useCollectionPointsDialog } from "@/hooks/useCollectionPointsDialog";
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
  
  // Usar o hook de diálogo para comportamento de diálogo estável
  const {
    isCarrierDialog,
    title,
    description,
    isStable,
    handleDialogError
  } = useCollectionPointsDialog({
    open,
    onOpenChange,
    establishmentId,
    establishmentName,
    carrierId: carrier?.id,
    carrierName: carrier?.name
  });
  
  // Log para diagnóstico das propriedades
  console.log("ManageCollectionPointsDialog props:", {
    open,
    carrier,
    establishmentId,
    isCarrierDialog
  });
  
  // Garantir que o conteúdo só seja renderizado após o diálogo estar aberto
  useEffect(() => {
    if (open) {
      // Pequeno atraso para garantir que o diálogo está pronto
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setIsReady(false);
    }
  }, [open]);

  // Gerar uma chave estável
  const dialogContentId = isCarrierDialog 
    ? `carrier-dialog-${carrier?.id}` 
    : `establishment-dialog-${establishmentId}`;

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpenState) => {
        // Se estamos tentando fechar, permitir imediatamente
        if (!newOpenState || isStable) {
          onOpenChange(newOpenState);
        }
      }}
    >
      <DialogContent 
        className="max-w-4xl max-h-[85vh] overflow-y-auto" 
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          // Prevenir o fechamento do diálogo quando clicar fora durante a animação
          if (!isStable) {
            e.preventDefault();
          }
        }}
        id={dialogContentId}
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
              <Tabs defaultValue="manage" className="mt-4">
                <TabsList className={`${isMobile ? 'flex flex-col space-y-1 h-auto' : ''}`}>
                  <TabsTrigger value="manage" className="flex-1">
                    Gerenciar Associações
                  </TabsTrigger>
                  <TabsTrigger value="carrier" className="flex-1">
                    Pontos da Transportadora
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="manage" className="pt-4 pb-2">
                  <CollectionPointAssociationTab 
                    carrierId={carrier?.id} 
                    skipCarrierHeader={true} 
                  />
                </TabsContent>
                <TabsContent value="carrier" className="pt-4 pb-2">
                  <CollectionPointsTab 
                    carrierContext={{ carrierId: carrier?.id }} 
                  />
                </TabsContent>
              </Tabs>
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
