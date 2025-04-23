
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Phone, ListCollapse, Check, X, MapPin, Building } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { formatOperatingHours } from "./utils/formatters";
import { maskPhoneBR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { CollectionPointActionsDropdown } from "./CollectionPointActionsDropdown";
import { useCarriers } from "@/hooks/useCarriers";
import { useState, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface CollectionPointDesktopTableProps {
  collectionPoints: CollectionPoint[];
  onEdit: (point: CollectionPoint) => void;
  onDelete: (pointId: string) => void;
  onAssignCarrier: (pointId: string, carrierId: string | null) => Promise<void>;
}

export function CollectionPointDesktopTable({
  collectionPoints,
  onEdit,
  onDelete,
  onAssignCarrier,
}: CollectionPointDesktopTableProps) {
  const { carriers } = useCarriers();
  const { isMobile } = useIsMobile();
  
  const carrierMap = useMemo(() => {
    return new Map(carriers.map(carrier => [carrier.id, carrier]));
  }, [carriers]);

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

  // Mobile view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {collectionPoints.map((point) => (
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
                  <span className="font-medium">
                    {carrierMap.get(point.carrier_id)?.name || "Carregando..."}
                  </span>
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
                
                <div className="flex-1"></div>
                
                <CollectionPointActionsDropdown 
                  point={point}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAssignCarrier={onAssignCarrier}
                />
              </div>
            </div>
          </Card>
        ))}
        
        {collectionPoints.length === 0 && (
          <div className="text-center p-8 border rounded-md bg-background">
            <p className="text-muted-foreground">Nenhum ponto de coleta encontrado</p>
          </div>
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Cidade/UF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Transportadora</TableHead>
              <TableHead>Horários</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collectionPoints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum ponto de coleta encontrado</p>
                </TableCell>
              </TableRow>
            ) : (
              collectionPoints.map((point) => (
                <TableRow key={point.id}>
                  <TableCell>{point.name}</TableCell>
                  <TableCell>{getSimpleAddress(point)}</TableCell>
                  <TableCell>{getLocation(point)}</TableCell>
                  <TableCell>
                    {point.phone ? (
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{maskPhoneBR(point.phone)}</span>
                      </div>
                    ) : (
                      "Não informado"
                    )}
                  </TableCell>
                  <TableCell>
                    {point.carrier_id ? (
                      <span className="text-sm font-medium">
                        {carrierMap.get(point.carrier_id)?.name || "Carregando..."}
                      </span>
                    ) : (
                      <span className="text-sm text-destructive font-medium">Não associada</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ListCollapse className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="flex flex-col space-y-1">
                          {formatOperatingHours(point.operating_hours).split('\n').map((line, index) => (
                            <div key={index} className="text-sm">
                              <span>{line}</span>
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    {point.is_active ? (
                      <div className="flex items-center gap-1">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Ativo</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <X className="h-4 w-4 text-destructive" />
                        <span>Inativo</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <CollectionPointActionsDropdown 
                      point={point}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onAssignCarrier={onAssignCarrier}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
