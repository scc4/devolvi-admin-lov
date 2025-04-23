
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Clock, Edit, Trash2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import type { CollectionPoint } from "@/types/collection-point";
import { checkOpenStatus } from "../../utils/checkOpenStatus";
import { formatOperatingHours } from "../../utils/formatters";
import { getSimpleAddress, getLocation } from "../../utils/addressHelpers";

interface CollectionPointTableRowProps {
  point: CollectionPoint;
  onEdit?: (point: CollectionPoint) => void;
  onDelete?: (pointId: string) => void;
  carrierMap: Map<string, { name: string }>;
}

export function CollectionPointTableRow({
  point,
  onEdit,
  onDelete,
  carrierMap
}: CollectionPointTableRowProps) {
  const status = checkOpenStatus(point);

  return (
    <TableRow>
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
          {onEdit && (
            <Button variant="outline" size="icon" onClick={() => onEdit(point)}>
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="icon" onClick={() => onDelete(point.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
