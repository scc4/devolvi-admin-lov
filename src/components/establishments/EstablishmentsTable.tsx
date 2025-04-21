
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EstablishmentWithDetails } from "@/types/establishment";
import { EstablishmentsTableLoading } from "./EstablishmentsTableLoading";
import { EstablishmentsTableEmpty } from "./EstablishmentsTableEmpty";
import { EstablishmentTableRow } from "./EstablishmentTableRow";

interface EstablishmentsTableProps {
  establishments: EstablishmentWithDetails[];
  loading: boolean;
  onEdit: (establishment: EstablishmentWithDetails) => void;
  onDelete: (establishment: EstablishmentWithDetails) => void;
  onManageCollectionPoints: (establishment: EstablishmentWithDetails) => void;
}

export function EstablishmentsTable({
  establishments,
  loading,
  onEdit,
  onDelete,
  onManageCollectionPoints,
}: EstablishmentsTableProps) {
  if (loading) {
    return <EstablishmentsTableLoading />;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Pontos de Coleta</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {establishments.length === 0 ? (
            <EstablishmentsTableEmpty />
          ) : (
            establishments.map((establishment) => (
              <EstablishmentTableRow
                key={establishment.id}
                establishment={establishment}
                onEdit={onEdit}
                onDelete={onDelete}
                onManageCollectionPoints={onManageCollectionPoints}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
