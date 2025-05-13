
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";

interface CarriersTableProps {
  carriers: (Carrier & { collection_points_count?: number })[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  onEdit: (carrier: Carrier) => void;
  onDelete: (carrier: Carrier) => void;
  onDeactivate?: (carrier: Carrier) => void;
  onManageCollectionPoints: (carrier: Carrier) => void;
}

export function CarriersTable({
  carriers,
  loading,
  error,
  onRetry,
  onEdit,
  onDelete,
  onDeactivate = () => {},
  onManageCollectionPoints,
}: CarriersTableProps) {
  const { isMobile } = useIsMobile();

  // Mobile view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {loading ? (
          <Card className="p-4 text-center">
            <p className="text-muted-foreground">Carregando...</p>
          </Card>
        ) : carriers.length === 0 ? (
          <Card className="p-4 text-center">
            <p className="text-muted-foreground">Nenhuma transportadora encontrada</p>
          </Card>
        ) : (
          carriers.map((carrier) => (
            <Card key={carrier.id} className="p-4 shadow-sm">
              <div className="flex flex-col space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{carrier.name}</h3>
                    <p className="text-sm text-muted-foreground">{carrier.city}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${carrier.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    `}
                  >
                    {carrier.is_active ? "Ativo" : "Inativo"}
                  </span>
                </div>
                
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Gestor:</span> {carrier.manager}</p>
                  {carrier.phone && <p><span className="font-medium">Telefone:</span> {formatPhoneBR(carrier.phone)}</p>}
                  {carrier.email && <p><span className="font-medium">E-mail:</span> {carrier.email}</p>}
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {carrier.collection_points_count} pontos
                  </div>
                  <CarrierActionsDropdown
                    carrier={carrier}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDeactivate={onDeactivate}
                    onManageCollectionPoints={onManageCollectionPoints}
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    );
  }

  // Desktop view
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
            <TableHead>Pontos de Coleta</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Carregando...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                <div className="space-y-2">
                  <p className="text-red-500">{error}</p>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="text-primary hover:underline"
                    >
                      Tentar novamente
                    </button>
                  )}
                </div>
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
                <TableCell>
                  <span className="font-medium">
                    {carrier.collection_points_count || 0}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <CarrierActionsDropdown
                    carrier={carrier}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDeactivate={onDeactivate}
                    onManageCollectionPoints={onManageCollectionPoints}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Nenhuma transportadora encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
