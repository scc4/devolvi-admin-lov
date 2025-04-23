
import {
  Table,
  TableBody,
  TableCaption,
  TableFooter,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { CollectionPoint } from "@/types/collection-point";
import { CollectionPointTableHeader } from "./table/CollectionPointTableHeader";
import { CollectionPointTableRow } from "./table/CollectionPointTableRow";

interface CollectionPointDesktopViewProps {
  collectionPoints: CollectionPoint[];
  isLoading: boolean;
  onEdit?: (point: CollectionPoint) => void;
  onDelete?: (pointId: string) => void;
  carrierMap: Map<string, { name: string }>;
}

export function CollectionPointDesktopView({
  collectionPoints,
  isLoading,
  onEdit,
  onDelete,
  carrierMap
}: CollectionPointDesktopViewProps) {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableCaption>Lista de pontos de coleta.</TableCaption>
        <CollectionPointTableHeader />
        <TableBody>
          {collectionPoints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Nenhum ponto de coleta encontrado.
              </TableCell>
            </TableRow>
          ) : (
            collectionPoints.map((point) => (
              <CollectionPointTableRow
                key={point.id}
                point={point}
                onEdit={onEdit}
                onDelete={onDelete}
                carrierMap={carrierMap}
              />
            ))
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
