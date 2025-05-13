
import { useState } from "react";
import { CollectionPointsTable } from "./CollectionPointsTable";
import { CollectionPointAssociationHeader } from "./CollectionPointAssociationHeader";
import { useCollectionPointAssociation } from "@/hooks/useCollectionPointAssociation";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Printer } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { CollectionPointsPrintView } from "./CollectionPointsPrintView";
import type { CollectionPoint } from "@/types/collection-point";

interface CollectionPointAssociationTabProps {
  carrierId?: string;
  establishmentId?: string;
  skipCarrierHeader?: boolean;
}

export function CollectionPointAssociationTab({ 
  carrierId,
  establishmentId,
  skipCarrierHeader = false 
}: CollectionPointAssociationTabProps) {
  const {
    carrierName,
    carrierCity,
    filteredUnassignedPoints,
    carrierPoints,
    isLoadingUnassigned,
    isLoadingCarrier,
    isLoadingServedCities,
    handleAssociate,
    handleDisassociate,
    filterByServedCities,
    setFilterByServedCities,
    refetchUnassigned,
    refetchCarrier
  } = useCollectionPointAssociation(carrierId || '');

  const [activeTab, setActiveTab] = useState<"available" | "associated">("available");
  const [isPrinting, setIsPrinting] = useState(false);
  const { isMobile } = useIsMobile();

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const handleRefresh = () => {
    if (activeTab === "available") {
      refetchUnassigned();
    } else {
      refetchCarrier();
    }
  };

  if (isLoadingServedCities && carrierId) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!skipCarrierHeader && carrierId && (
        <>
          <CollectionPointAssociationHeader
            carrierName={carrierName}
            carrierCity={carrierCity}
            onRefresh={handleRefresh}
            onPrint={handlePrint}
          />
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={activeTab === "available" ? "default" : "outline"}
              onClick={() => setActiveTab("available")}
              className="w-full"
            >
              Pontos Disponíveis
            </Button>
            <Button
              variant={activeTab === "associated" ? "default" : "outline"}
              onClick={() => setActiveTab("associated")}
              className="w-full"
            >
              Pontos Associados
            </Button>
          </div>
        </>
      )}

      {carrierId && activeTab === "available" ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pontos Disponíveis</h2>
            <Button variant="outline" size="sm" onClick={() => refetchUnassigned()}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              {!isMobile && "Atualizar"}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="cityFilter"
              checked={filterByServedCities}
              onCheckedChange={(checked) => 
                setFilterByServedCities(checked as boolean)
              }
            />
            <label
              htmlFor="cityFilter"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Exibir apenas pontos em cidades atendidas
            </label>
          </div>

          <CollectionPointsTable
            collectionPoints={filteredUnassignedPoints}
            isLoading={isLoadingUnassigned}
            actionLabel="Associar"
            onAction={(point: CollectionPoint) => handleAssociate(point)}
          />
        </div>
      ) : carrierId ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Pontos Associados</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => refetchCarrier()}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                {!isMobile && "Atualizar"}
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                {!isMobile && "Imprimir"}
              </Button>
            </div>
          </div>

          <CollectionPointsTable
            collectionPoints={carrierPoints}
            isLoading={isLoadingCarrier}
            actionLabel="Desassociar"
            onAction={(point: CollectionPoint) => handleDisassociate(point)}
          />
        </div>
      ) : null}

      {isPrinting && carrierId && (
        <CollectionPointsPrintView
          collectionPoints={carrierPoints}
          title={`Pontos de Coleta - ${carrierName}`}
        />
      )}
    </div>
  );
}
