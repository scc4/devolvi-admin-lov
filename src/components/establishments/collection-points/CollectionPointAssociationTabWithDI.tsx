
import { useState } from "react";
import { useCollectionPointCasesWithDI } from "@/presentation/hooks/useCollectionPointCasesWithDI";
import { CollectionPointsTable } from "./CollectionPointsTable";
import { CollectionPointAssociationHeader } from "./CollectionPointAssociationHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionPointsPrintView } from "./CollectionPointsPrintView";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { createRoot } from 'react-dom/client';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CollectionPointAssociationTabWithDIProps {
  carrierId: string;
}

export function CollectionPointAssociationTabWithDI({ carrierId }: CollectionPointAssociationTabWithDIProps) {
  const [filterByServedCities, setFilterByServedCities] = useState(true);
  const [carrierName, setCarrierName] = useState<string>("");
  const { isMobile } = useIsMobile();

  // Fetch carrier details
  useQuery({
    queryKey: ['carrier-details', carrierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carriers')
        .select('name, city')
        .eq('id', carrierId)
        .single();
      
      if (data) {
        setCarrierName(data.name);
      }
      return data;
    },
  });

  // Fetch served cities
  const { data: servedCities = [], isLoading: isLoadingServedCities } = useQuery({
    queryKey: ['served-cities', carrierId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carrier_served_cities')
        .select('city')
        .eq('carrier_id', carrierId);

      if (error) {
        toast.error('Erro ao carregar cidades atendidas');
        throw error;
      }
      
      return data.map(row => row.city);
    },
  });

  // Fetch unassigned points
  const {
    collectionPoints: unassignedPoints,
    loading: isLoadingUnassigned,
    loadCollectionPoints: refetchUnassigned,
    handleAssignCarrier,
  } = useCollectionPointCasesWithDI({
    unassigned: true
  });

  // Fetch carrier points
  const {
    collectionPoints: carrierPoints,
    loading: isLoadingCarrier,
    loadCollectionPoints: refetchCarrier,
  } = useCollectionPointCasesWithDI({
    carrierId
  });

  // Filter points based on served cities
  const filteredUnassignedPoints = filterByServedCities
    ? unassignedPoints.filter(point => servedCities.includes(point.city || ''))
    : unassignedPoints;

  const handleAssociate = async (point: any) => {
    try {
      await handleAssignCarrier(point.id, carrierId);
      refetchUnassigned();
      refetchCarrier();
    } catch (error) {
      console.error('Error associating collection point:', error);
    }
  };

  const handleDisassociate = async (point: any) => {
    try {
      await handleAssignCarrier(point.id, null);
      refetchUnassigned();
      refetchCarrier();
    } catch (error) {
      console.error('Error disassociating collection point:', error);
    }
  };

  const handleRefresh = () => {
    refetchUnassigned();
    refetchCarrier();
  };

  const handlePrint = () => {
    if (!carrierPoints?.length) {
      toast.error('Não há pontos de coleta para imprimir');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Não foi possível abrir a janela de impressão');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Pontos de Coleta</title>
          <link rel="stylesheet" href="/src/index.css">
          <style>
            @media print {
              body { margin: 0; background: white; }
              @page { size: portrait; margin: 20mm; }
            }
          </style>
        </head>
        <body>
          <div id="print-content"></div>
        </body>
      </html>
    `);

    const printContent = printWindow.document.getElementById('print-content');
    if (printContent && carrierPoints) {
      const root = createRoot(printContent);
      root.render(<CollectionPointsPrintView collectionPoints={carrierPoints} />);

      // Wait for styles and images to load
      printWindow.setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 1000);
    }
  };

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
        <div className="flex flex-col gap-4">
          <TabsList className="w-full">
            <TabsTrigger value="unassigned" className="flex-1">Pontos Disponíveis</TabsTrigger>
            <TabsTrigger value="associated" className="flex-1">Pontos Associados</TabsTrigger>
          </TabsList>
          <CollectionPointAssociationHeader 
            onRefresh={handleRefresh}
            onPrint={handlePrint}
          />
        </div>

        <TabsContent value="unassigned" className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="city-filter"
              checked={filterByServedCities}
              onCheckedChange={(checked) => setFilterByServedCities(checked as boolean)}
            />
            <label
              htmlFor="city-filter"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Exibir apenas pontos em cidades atendidas
            </label>
          </div>
          {isLoadingServedCities ? (
            <div className="text-center py-4 text-muted-foreground">
              Carregando cidades atendidas...
            </div>
          ) : (
            <CollectionPointsTable
              collectionPoints={filteredUnassignedPoints}
              isLoading={isLoadingUnassigned}
              onAssociate={handleAssociate}
              showAssociateButton
            />
          )}
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
