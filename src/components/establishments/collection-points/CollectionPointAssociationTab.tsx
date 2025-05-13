import { useCollectionPointAssociation } from "@/hooks/useCollectionPointAssociation";
import { CollectionPointsTable } from "./CollectionPointsTable";
import { CollectionPointAssociationHeader } from "./CollectionPointAssociationHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionPointsPrintView } from "./CollectionPointsPrintView";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { createRoot } from 'react-dom/client';

interface CollectionPointAssociationTabProps {
  carrierId: string;
}

export function CollectionPointAssociationTab({ carrierId }: CollectionPointAssociationTabProps) {
  const {
    carrierName,
    filterByServedCities,
    setFilterByServedCities,
    filteredUnassignedPoints,
    carrierPoints,
    isLoadingServedCities,
    isLoadingUnassigned,
    isLoadingCarrier,
    handleAssociate,
    handleDisassociate,
    refetchUnassigned,
    refetchCarrier
  } = useCollectionPointAssociation(carrierId);

  const { isMobile } = useIsMobile();

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
