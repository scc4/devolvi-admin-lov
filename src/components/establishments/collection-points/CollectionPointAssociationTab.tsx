
import { useState, useEffect, useRef } from "react";
import { useCollectionPointCases } from "@/presentation/hooks/useCollectionPointCases";
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
import { Progress } from "@/components/ui/progress";
import { collectionPointAdapter } from "@/adapters/collectionPoints/collectionPointAdapter";

interface CollectionPointAssociationTabProps {
  carrierId: string;
}

export function CollectionPointAssociationTab({ carrierId }: CollectionPointAssociationTabProps) {
  const [filterByServedCities, setFilterByServedCities] = useState(true);
  const [carrierName, setCarrierName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("unassigned");
  const { isMobile } = useIsMobile();
  const initialLoadDone = useRef({
    unassigned: false,
    carrier: false
  });

  // Fetch carrier details
  const { isLoading: isLoadingCarrierDetails } = useQuery({
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
  } = useCollectionPointCases({
    unassigned: true
  });

  // Fetch carrier points
  const {
    collectionPoints: carrierPoints,
    loading: isLoadingCarrier,
    loadCollectionPoints: refetchCarrier,
  } = useCollectionPointCases({
    carrierId
  });

  // Filter points based on served cities
  const filteredUnassignedPoints = filterByServedCities
    ? unassignedPoints.filter(point => servedCities.includes(point.city || ''))
    : unassignedPoints;

  // Load the correct data based on active tab
  useEffect(() => {
    const loadData = async () => {
      if (activeTab === "unassigned" && !initialLoadDone.current.unassigned) {
        await refetchUnassigned();
        initialLoadDone.current.unassigned = true;
      } else if (activeTab === "associated" && !initialLoadDone.current.carrier) {
        await refetchCarrier();
        initialLoadDone.current.carrier = true;
      }
    };
    
    loadData();
  }, [activeTab, refetchUnassigned, refetchCarrier]);

  const handleAssociate = async (point: any) => {
    try {
      // Convert UI model to DTO before passing to the handler
      const pointDTO = collectionPointAdapter.fromUIModel(point);
      await handleAssignCarrier(pointDTO.id, carrierId);
      refetchUnassigned();
      refetchCarrier();
    } catch (error) {
      console.error('Error associating collection point:', error);
    }
  };

  const handleDisassociate = async (point: any) => {
    try {
      // Convert UI model to DTO before passing to the handler
      const pointDTO = collectionPointAdapter.fromUIModel(point);
      await handleAssignCarrier(pointDTO.id, null);
      refetchUnassigned();
      refetchCarrier();
    } catch (error) {
      console.error('Error disassociating collection point:', error);
    }
  };

  const handleRefresh = () => {
    if (activeTab === "unassigned") {
      refetchUnassigned();
    } else {
      refetchCarrier();
    }
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

  const isLoading = isLoadingCarrierDetails || isLoadingServedCities || 
                   (activeTab === "unassigned" ? isLoadingUnassigned : isLoadingCarrier);

  return (
    <div className="space-y-6">
      {carrierName && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-primary">
            Transportadora: {carrierName}
          </h2>
        </div>
      )}
      
      <Tabs 
        defaultValue="unassigned" 
        className="space-y-6"
        onValueChange={setActiveTab}
      >
        <div className="flex flex-col gap-4">
          <TabsList className="w-full">
            <TabsTrigger value="unassigned" className="flex-1">Pontos Disponíveis</TabsTrigger>
            <TabsTrigger value="associated" className="flex-1">Pontos Associados</TabsTrigger>
          </TabsList>
          <CollectionPointAssociationHeader 
            onRefresh={handleRefresh}
            onPrint={handlePrint}
            isLoading={isLoading}
            title={activeTab === "unassigned" ? "Pontos Disponíveis" : "Pontos Associados"}
          />
        </div>

        {isLoading && (
          <div className="py-4">
            <Progress value={75} className="w-full h-1" />
            <p className="text-center text-sm text-muted-foreground mt-2">Carregando dados...</p>
          </div>
        )}

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
          {!isLoading && (
            <CollectionPointsTable
              collectionPoints={filteredUnassignedPoints}
              isLoading={false}
              onAssociate={handleAssociate}
              showAssociateButton
            />
          )}
        </TabsContent>

        <TabsContent value="associated" className="space-y-4">
          {!isLoading && (
            <CollectionPointsTable
              collectionPoints={carrierPoints}
              isLoading={false}
              onDisassociate={handleDisassociate}
              showDisassociateButton
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
