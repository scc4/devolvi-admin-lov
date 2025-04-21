
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CarrierActionsDropdown } from "./CarrierActionsDropdown";
import { formatPhoneBR } from "@/lib/format";
import type { Carrier } from "@/types/carrier";

interface CarriersTableProps {
  carriers: Carrier[];
  loading: boolean;
  onEdit: (carrier: Carrier) => void;
  onDelete: (carrier: Carrier) => void;
  onDeactivate: (carrier: Carrier) => void;
}

export function CarriersTable({
  carriers,
  loading,
  onEdit,
  onDelete,
  onDeactivate,
}: CarriersTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Gestor</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Carregando...
              </TableCell>
            </TableRow>
          ) : carriers.length > 0 ? (
            carriers.map((carrier) => (
              <TableRow key={carrier.id}>
                <TableCell>{carrier.name}</TableCell>
                <TableCell>{carrier.city}</TableCell>
                <TableCell>{carrier.manager}</TableCell>
                <TableCell>{carrier.phone ? formatPhoneBR(carrier.phone) : <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell>{carrier.email || <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${carrier.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    `}
                  >
                    {carrier.is_active ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <CarrierActionsDropdown
                    carrier={carrier}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDeactivate={onDeactivate}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Nenhuma transportadora encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
