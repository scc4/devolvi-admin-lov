
import { TableCell, TableRow } from "@/components/ui/table";
import type { EstablishmentWithDetails } from "@/types/establishment";
import { EstablishmentActionsDropdown } from "./EstablishmentActionsDropdown";

interface EstablishmentTableRowProps {
  establishment: EstablishmentWithDetails;
  onEdit: (establishment: EstablishmentWithDetails) => void;
  onDelete: (establishment: EstablishmentWithDetails) => void;
  onManageCollectionPoints: (establishment: EstablishmentWithDetails) => void;
  onManagePudo?: (establishment: EstablishmentWithDetails) => void;
}

export function EstablishmentTableRow({
  establishment,
  onEdit,
  onDelete,
  onManageCollectionPoints,
  onManagePudo,
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
        <div className="flex justify-end">
          <EstablishmentActionsDropdown
            establishment={establishment}
            onEdit={onEdit}
            onDelete={onDelete}
            onManageCollectionPoints={onManageCollectionPoints}
            onManagePudo={onManagePudo}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
