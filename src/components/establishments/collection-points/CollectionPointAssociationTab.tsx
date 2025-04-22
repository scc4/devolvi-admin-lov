import { useState, useEffect } from "react";
import { useCollectionPoints } from "@/hooks/useCollectionPoints";
import { CollectionPointsTable } from "./CollectionPointsTable";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Printer } from "lucide-react";
import { toast } from "sonner";
import type { CollectionPoint } from "@/types/collection-point";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionPointsPrintView } from "./CollectionPointsPrintView";

interface CollectionPointAssociationTabProps {
  carrierId: string;
}

export function CollectionPointAssociationTab({ carrierId }: CollectionPointAssociationTabProps) {
  const [carrierName, setCarrierName] = useState<string>("");
  
  const {
    collectionPoints: unassignedPoints,
    isLoading: isLoadingUnassigned,
    refetch: refetchUnassigned
  } = useCollectionPoints(undefined, undefined, true); // fetch unassigned points

  const {
    collectionPoints: carrierPoints,
    isLoading: isLoadingCarrier,
    refetch: refetchCarrier
  } = useCollectionPoints(undefined, carrierId); // fetch carrier points

  // Ensure proper cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear any lingering portal elements on unmount
      document.body.style.pointerEvents = '';
      const overlays = document.querySelectorAll('[data-radix-portal]');
      overlays.forEach(overlay => {
        if (!overlay.contains(document.activeElement)) {
          (overlay as HTMLElement).style.display = 'none';
        }
      });
    };
  }, []);

  const handleAssociate = async (point: CollectionPoint) => {
    try {
      const { error } = await supabase
        .from('collection_points')
        .update({ carrier_id: carrierId })
        .eq('id', point.id);

      if (error) throw error;
      
      toast.success('Ponto de coleta associado com sucesso');
      refetchUnassigned();
      refetchCarrier();
    } catch (error) {
      console.error('Error associating collection point:', error);
      toast.error('Erro ao associar ponto de coleta');
    }
  };

  const handleDisassociate = async (point: CollectionPoint) => {
    try {
      const { error } = await supabase
        .from('collection_points')
        .update({ carrier_id: null })
        .eq('id', point.id);

      if (error) throw error;
      
      toast.success('Ponto de coleta desassociado com sucesso');
      refetchUnassigned();
      refetchCarrier();
    } catch (error) {
      console.error('Error disassociating collection point:', error);
      toast.error('Erro ao desassociar ponto de coleta');
    }
  };

  const handleRefresh = () => {
    refetchUnassigned();
    refetchCarrier();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Não foi possível abrir a janela de impressão');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Relatório de Pontos de Coleta</title>
          <link rel="stylesheet" href="/src/index.css">
        </head>
        <body>
          <div id="print-content"></div>
        </body>
      </html>
    `);

    // Render the print view component
    const printContent = printWindow.document.getElementById('print-content');
    if (printContent && carrierPoints) {
      const root = document.createElement('div');
      root.innerHTML = `<div class="min-h-screen bg-background text-foreground">
        ${CollectionPointsPrintView({ collectionPoints: carrierPoints }).type({
          collectionPoints: carrierPoints
        }).props.children}
      </div>`;
      printContent.appendChild(root);

      // Wait for styles to load
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  // Fetch carrier name
  useEffect(() => {
    const fetchCarrierName = async () => {
      const { data, error } = await supabase
        .from('carriers')
        .select('name')
        .eq('id', carrierId)
        .single();
      
      if (data) {
        setCarrierName(data.name);
      }
    };
    
    fetchCarrierName();
  }, [carrierId]);

  return (
    <div className="space-y-6">
      {carrierName && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-primary">
            Transportadora: {carrierName}
          </h2>
        </div>
      )}
      
      <Tabs defaultValue="unassigned" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="unassigned">Pontos Disponíveis</TabsTrigger>
            <TabsTrigger value="associated">Pontos Associados</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>

        <TabsContent value="unassigned" className="space-y-4">
          <CollectionPointsTable
            collectionPoints={unassignedPoints}
            isLoading={isLoadingUnassigned}
            onAssociate={handleAssociate}
            showAssociateButton
          />
        </TabsContent>

        <TabsContent value="associated" className="space-y-4">
          <CollectionPointsTable
            collectionPoints={carrierPoints}
            isLoading={isLoadingCarrier}
            onDisassociate={handleDisassociate}
            showDisassociateButton
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
