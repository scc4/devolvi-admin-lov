
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
import { Edit, Trash2 } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";

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
  if (showAssociateButton || showDisassociateButton) {
    return (
      <div className="space-y-4">
        {collectionPoints.map((point) => (
          <div key={point.id} className="bg-white p-4 rounded-lg shadow border">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{point.name}</h3>
                <p className="text-sm text-gray-600">{point.address}</p>
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
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">Carregando...</TableCell>
            </TableRow>
          ) : collectionPoints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">Nenhum ponto de coleta encontrado.</TableCell>
            </TableRow>
          ) : (
            collectionPoints.map((point) => (
              <TableRow key={point.id}>
                <TableCell className="font-medium">{point.name}</TableCell>
                <TableCell>{point.address}</TableCell>
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
            ))
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>
              {collectionPoints.length} Ponto(s) de Coleta no total
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
