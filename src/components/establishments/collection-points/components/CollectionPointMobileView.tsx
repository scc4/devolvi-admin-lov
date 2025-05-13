
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Building, Edit, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { CollectionPoint } from "@/types/collection-point";
import { checkOpenStatus } from "../utils/checkOpenStatus";
import { formatOperatingHours } from "../utils/formatters";
import { getSimpleAddress, getLocation } from "../utils/addressHelpers";

interface CollectionPointMobileViewProps {
  collectionPoints: CollectionPoint[];
  isLoading: boolean;
  onEdit?: (point: CollectionPoint) => void;
  onDelete?: (pointId: string) => void;
  carrierMap: Map<string, { name: string }>;
}

export function CollectionPointMobileView({
  collectionPoints,
  isLoading,
  onEdit,
  onDelete,
  carrierMap
}: CollectionPointMobileViewProps) {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (collectionPoints.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Nenhum ponto de coleta encontrado.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {collectionPoints.map((point) => {
        const status = checkOpenStatus(point);
        return (
          <Card key={point.id} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-base">{point.name}</h3>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-2 -mr-2">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className={status.isOpen ? "text-green-600" : "text-red-600"}>
                        {status.isOpen ? "Aberto" : "Fechado"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72">
                    <div className="text-sm">
                      {formatOperatingHours(point.operating_hours)}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{getSimpleAddress(point)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{getLocation(point)}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <span className="font-medium mr-2">Transportadora:</span>
                {point.carrier_id ? (
                  <span>{carrierMap.get(point.carrier_id)?.name || "Carregando..."}</span>
                ) : (
                  <span className="text-destructive">Não associada</span>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t mt-2">
                {onEdit && (
                  <Button variant="outline" size="sm" onClick={() => onEdit(point)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <Button variant="destructive" size="sm" onClick={() => onDelete(point.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
      
      <div className="bg-muted/50 p-3 rounded text-sm text-center">
        {collectionPoints.length} Ponto(s) de Coleta no total
      </div>
    </div>
  );
}
