
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { CollectionPointTableHeader } from "./table/CollectionPointTableHeader";
import { CollectionPointTableRow } from "./table/CollectionPointTableRow";
import { Skeleton } from "@/components/ui/skeleton";
import type { CollectionPoint } from "@/types/collection-point";

interface CollectionPointDesktopViewProps {
  collectionPoints: CollectionPoint[];
  isLoading?: boolean;
  onEdit?: (point: CollectionPoint) => void;
  onDelete?: (pointId: string) => void;
  onAssignCarrier?: (pointId: string, carrierId: string | null) => Promise<void>;
  carrierMap?: Map<string, any>;
}

export function CollectionPointDesktopView({
  collectionPoints,
  isLoading,
  onEdit,
  onDelete,
  onAssignCarrier,
  carrierMap
}: CollectionPointDesktopViewProps) {
  if (isLoading) {
    return (
      <div className="border rounded-md">
        <div className="p-4">
          <Skeleton className="h-8 w-3/4" />
        </div>
        <div className="p-4 border-t">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="py-2">
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <CollectionPointTableHeader showCarrier={!!carrierMap} />
        </TableHeader>
        <TableBody>
          {collectionPoints.length === 0 ? (
            <tr>
              <td colSpan={6} className="h-24 text-center text-gray-500">
                Nenhum ponto de coleta encontrado
              </td>
            </tr>
          ) : (
            collectionPoints.map((point) => (
              <CollectionPointTableRow
                key={point.id}
                point={point}
                onEdit={() => onEdit?.(point)}
                onDelete={() => onDelete?.(point.id)}
                onAssignCarrier={onAssignCarrier ? (carrierId) => onAssignCarrier(point.id, carrierId) : undefined}
                carrierName={point.carrier_id && carrierMap ? carrierMap.get(point.carrier_id)?.name : undefined}
                showCarrier={!!carrierMap}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
