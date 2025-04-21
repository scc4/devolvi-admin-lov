
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2 } from "lucide-react";
import type { EstablishmentWithDetails } from "@/types/establishment";

interface EstablishmentTableRowProps {
  establishment: EstablishmentWithDetails;
  onEdit: (establishment: EstablishmentWithDetails) => void;
  onDelete: (establishment: EstablishmentWithDetails) => void;
}

export function EstablishmentTableRow({
  establishment,
  onEdit,
  onDelete,
}: EstablishmentTableRowProps) {
  return (
    <TableRow key={establishment.id}>
      <TableCell className="font-medium">{establishment.id.slice(0, 8)}</TableCell>
      <TableCell>{establishment.name}</TableCell>
      <TableCell>
        {establishment.type === 'public' ? 'Público' : 'Privado'}
      </TableCell>
      <TableCell className="text-right">
        {establishment.collection_points_count}
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(establishment)}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(establishment)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
