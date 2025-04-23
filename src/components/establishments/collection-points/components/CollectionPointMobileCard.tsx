
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, ListCollapse, MapPin, Building } from "lucide-react";
import { CollectionPointActionsDropdown } from "../CollectionPointActionsDropdown";
import type { CollectionPoint } from "@/types/collection-point";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { formatOperatingHours } from "../utils/formatters";
import { maskPhoneBR } from "@/lib/format";

interface CollectionPointMobileCardProps {
  point: CollectionPoint;
  onEdit: (point: CollectionPoint) => void;
  onDelete: (pointId: string) => void;
  onAssignCarrier: (pointId: string, carrierId: string | null) => Promise<void>;
  carrierName?: string;
}

export function CollectionPointMobileCard({
  point,
  onEdit,
  onDelete,
  onAssignCarrier,
  carrierName,
}: CollectionPointMobileCardProps) {
  const getSimpleAddress = (point: CollectionPoint) => {
    const parts = [];
    if (point.street) parts.push(point.street);
    if (point.number) parts.push(point.number);
    return parts.length > 0 ? parts.join(', ') : 'Não informado';
  };

  const getLocation = (point: CollectionPoint) => {
    const parts = [];
    if (point.city) parts.push(point.city);
    if (point.state) parts.push(point.state);
    return parts.length > 0 ? parts.join('/') : 'Não informado';
  };

  return (
    <Card key={point.id} className="p-4 shadow-sm">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between">
          <h3 className="font-medium text-base">{point.name}</h3>
          <Badge variant={point.is_active ? "success" : "destructive"}>
            {point.is_active ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        
        {point.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{maskPhoneBR(point.phone)}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{getSimpleAddress(point)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span>{getLocation(point)}</span>
        </div>
        
        {point.carrier_id ? (
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{carrierName || "Carregando..."}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Building className="h-4 w-4 text-destructive" />
            <span className="text-destructive font-medium">Sem transportadora</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8 px-2 gap-1">
            <ListCollapse className="h-3.5 w-3.5" />
            Horários
            <Popover>
              <PopoverTrigger className="sr-only">Ver horários</PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="flex flex-col space-y-1">
                  {formatOperatingHours(point.operating_hours).split('\n').map((line, index) => (
                    <div key={index} className="text-sm">
                      <span>{line}</span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </Button>
          
          <div className="flex-1" />
          
          <CollectionPointActionsDropdown 
            point={point}
            onEdit={onEdit}
            onDelete={onDelete}
            onAssignCarrier={onAssignCarrier}
          />
        </div>
      </div>
    </Card>
  );
}
