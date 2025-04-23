
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Clock, MapPin, Building } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import { checkOpenStatus } from "./utils/checkOpenStatus";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { formatOperatingHours } from "./utils/formatters";
import { useCarriers } from "@/hooks/useCarriers";
import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";

interface CollectionPointsTableProps {
  collectionPoints: CollectionPoint[];
  isLoading: boolean;
  onEdit?: (point: CollectionPoint) => void;
  onDelete?: (pointId: string) => void;
  onAssociate?: (point: CollectionPoint) => void;
  onDisassociate?: (point: CollectionPoint) => void;
  showAssociateButton?: boolean;
  showDisassociateButton?: boolean;
}

export function CollectionPointsTable({ 
  collectionPoints,
  isLoading,
  onEdit,
  onDelete,
  onAssociate,
  onDisassociate,
  showAssociateButton,
  showDisassociateButton
}: CollectionPointsTableProps) {
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

  // If we're showing association buttons, use the existing card layout
  if (showAssociateButton || showDisassociateButton) {
    return (
      <div className="space-y-4">
        {collectionPoints.map((point) => (
          <div key={point.id} className="bg-white p-4 rounded-lg shadow border">
            {point.establishment_id && (
              <h2 className="text-lg font-semibold mb-3 text-primary">
                {point.establishment?.name || 'Estabelecimento não definido'}
              </h2>
            )}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-semibold">{point.name}</h3>
                <p className="text-sm text-gray-600">{getSimpleAddress(point)}</p>
                <p className="text-xs text-gray-500">{getLocation(point)}</p>
                <div className="text-xs text-gray-500 space-y-0.5">
                  {point.district && <p><strong>Bairro:</strong> {point.district}</p>}
                  {point.establishment_id && (
                    <p>
                      <strong>Estabelecimento:</strong> {point.establishment?.name || 'Não definido'}
                    </p>
                  )}
                </div>
              </div>
              {showAssociateButton && (
                <Button
                  onClick={() => onAssociate?.(point)}
                  variant="outline"
                  size="sm"
                >
                  Associar
                </Button>
              )}
              {showDisassociateButton && (
                <Button
                  onClick={() => onDisassociate?.(point)}
                  variant="outline"
                  size="sm"
                >
                  Desassociar
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {collectionPoints.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {showAssociateButton 
              ? "Não há pontos de coleta disponíveis para associação"
              : "Não há pontos de coleta associados"
            }
          </div>
        )}
      </div>
    );
  }

  // Mobile view with cards
  if (isMobile) {
    return (
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
          </div>
        ) : collectionPoints.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Nenhum ponto de coleta encontrado.</p>
          </Card>
        ) : (
          <>
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
                              {status.isOpen ? "Open" : "Closed"}
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
          </>
        )}
      </div>
    );
  }

  // Desktop view with table
  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableCaption>Lista de pontos de coleta.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Cidade/UF</TableHead>
            <TableHead>Transportadora</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">Carregando...</TableCell>
            </TableRow>
          ) : collectionPoints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">Nenhum ponto de coleta encontrado.</TableCell>
            </TableRow>
          ) : (
            collectionPoints.map((point) => {
              const status = checkOpenStatus(point);
              return (
                <TableRow key={point.id}>
                  <TableCell className="font-medium">{point.name}</TableCell>
                  <TableCell>{getSimpleAddress(point)}</TableCell>
                  <TableCell>{getLocation(point)}</TableCell>
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
                        <Button variant="ghost" size="sm" className="h-8 space-x-2">
                          <Clock className="h-4 w-4" />
                          <span className={status.isOpen ? "text-green-600" : "text-red-600"}>
                            {status.isOpen ? "Open" : "Closed"}
                          </span>
                          {status.nextChange && (
                            <span className="text-muted-foreground">
                              · {status.nextChange.type === 'closes' ? 'Closes' : 'Opens'} {status.nextChange.time}
                              {status.nextChange.day ? ` ${status.nextChange.day}` : ''}
                            </span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="text-sm">
                          {formatOperatingHours(point.operating_hours)}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => onEdit?.(point)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => onDelete?.(point.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              {collectionPoints.length} Ponto(s) de Coleta no total
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
