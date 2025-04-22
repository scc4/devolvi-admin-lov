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
import { Edit, Trash2, Clock } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import { checkOpenStatus } from "./utils/checkOpenStatus";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { formatOperatingHours } from "./utils/formatters";

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
  // Display for association/disassociation view
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
                <p className="text-sm text-gray-600">{point.address}</p>
                <div className="text-xs text-gray-500 space-y-0.5">
                  {point.city && <p><strong>Cidade:</strong> {point.city}</p>}
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

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableCaption>Lista de pontos de coleta.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">Carregando...</TableCell>
            </TableRow>
          ) : collectionPoints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">Nenhum ponto de coleta encontrado.</TableCell>
            </TableRow>
          ) : (
            collectionPoints.map((point) => {
              const status = checkOpenStatus(point);
              return (
                <TableRow key={point.id}>
                  <TableCell className="font-medium">{point.name}</TableCell>
                  <TableCell>{point.address}</TableCell>
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
            <TableCell colSpan={4}>
              {collectionPoints.length} Ponto(s) de Coleta no total
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
