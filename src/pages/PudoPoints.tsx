
import { useEffect, useState } from "react";
import { useCollectionPointsV2 } from "@/hooks/useCollectionPointsV2";
import { CollectionPointsTabV2 } from "@/components/establishments/collection-points-v2/CollectionPointsTabV2";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function PudoPoints() {
  const [searchParams] = useSearchParams();
  const establishmentFilter = searchParams.get('establishment');
  const [cityFilter, setCityFilter] = useState<string>("");
  const [citySearchValue, setCitySearchValue] = useState<string>("");
  
  const {
    collectionPoints,
    isLoading,
    refetch
  } = useCollectionPointsV2(
    establishmentFilter, // Use establishment filter from URL
    null, // No carrier filter
    false, // Not fetching unassigned
    cityFilter // Apply city filter
  );

  // Filter for only PUDO points
  const pudoPoints = collectionPoints.filter(point => point.pudo === true);

  useEffect(() => {
    document.title = "PUDO - Devolvi Admin";
  }, []);

  const handleCitySearch = () => {
    setCityFilter(citySearchValue.trim());
  };

  const handleClearFilter = () => {
    setCitySearchValue("");
    setCityFilter("");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-1.5 mb-6">
        <h1 className="font-semibold text-2xl">PUDO</h1>
        <p className="text-muted-foreground">
          Gerencie os pontos PUDO (Pick Up Drop Off) para coleta e entrega.
          {establishmentFilter && <span className="font-medium ml-1">Filtrado por estabelecimento</span>}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 max-w-md">
          <div className="relative w-full">
            <Input
              placeholder="Filtrar por cidade"
              value={citySearchValue}
              onChange={(e) => setCitySearchValue(e.target.value)}
              className="pr-8"
              onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
            />
            <Search 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" 
              onClick={handleCitySearch}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={handleClearFilter}
            disabled={!cityFilter}
          >
            Limpar
          </Button>
        </div>
        {cityFilter && (
          <p className="text-sm text-muted-foreground mt-2">
            Mostrando pontos PUDO na cidade: <span className="font-medium">{cityFilter}</span>
          </p>
        )}
      </div>

      <CollectionPointsTabV2 
        establishmentId={establishmentFilter || undefined}
        pudoOnly={true}
      />
    </div>
  );
}

export default PudoPoints;
