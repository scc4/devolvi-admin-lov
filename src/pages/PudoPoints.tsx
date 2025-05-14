
import { useEffect, useState } from "react";
import { useCollectionPointsV2 } from "@/hooks/useCollectionPointsV2";
import { CollectionPointsTabV2 } from "@/components/establishments/collection-points-v2/CollectionPointsTabV2";

export function PudoPoints() {
  const [cityFilter, setCityFilter] = useState<string>("");
  
  const {
    collectionPoints,
    isLoading,
    refetch
  } = useCollectionPointsV2(
    null, // No establishment filter
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
        </p>
      </div>

      <CollectionPointsTabV2 />
    </div>
  );
}

export default PudoPoints;
