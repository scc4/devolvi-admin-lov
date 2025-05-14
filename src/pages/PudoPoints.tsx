
import { useEffect, useState } from "react";
import { useCollectionPointsV2 } from "@/hooks/useCollectionPointsV2";
import { CollectionPointsTabV2 } from "@/components/establishments/collection-points-v2/CollectionPointsTabV2";
import { useSearchParams } from "react-router-dom";

export function PudoPoints() {
  const [searchParams] = useSearchParams();
  const establishmentFilter = searchParams.get('establishment');
  const [cityFilter, setCityFilter] = useState<string>("");
  
  const {
    collectionPoints,
    isLoading,
    refetch
  } = useCollectionPointsV2(
    establishmentFilter, // Use establishment filter from URL
    null, // No carrier filter
    false, // Not fetching unassigned
    cityFilter
  );

  // Filter for only PUDO points
  const pudoPoints = collectionPoints.filter(point => point.pudo === true);

  useEffect(() => {
    document.title = "PUDO - Devolvi Admin";
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-1.5 mb-6">
        <h1 className="font-semibold text-2xl">PUDO</h1>
        <p className="text-muted-foreground">
          Gerencie os pontos PUDO (Pick Up Drop Off) para coleta e entrega.
          {establishmentFilter && <span className="font-medium ml-1">Filtrado por estabelecimento</span>}
        </p>
      </div>

      <CollectionPointsTabV2 
        initialFilter={establishmentFilter ? { establishment_id: establishmentFilter } : undefined}
        pudoOnly={true}
      />
    </div>
  );
}

export default PudoPoints;
