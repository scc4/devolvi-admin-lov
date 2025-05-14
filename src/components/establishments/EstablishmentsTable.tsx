
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
import { useIsMobile } from "@/hooks/use-mobile";
import { Package } from "lucide-react";

interface EstablishmentsTableProps {
  establishments: EstablishmentWithDetails[];
  loading: boolean;
  onEdit: (establishment: EstablishmentWithDetails) => void;
  onDelete: (establishment: EstablishmentWithDetails) => void;
  onManageCollectionPoints: (establishment: EstablishmentWithDetails) => void;
  onManagePudo?: (establishment: EstablishmentWithDetails) => void;
}

export function EstablishmentsTable({
  establishments,
  loading,
  onEdit,
  onDelete,
  onManageCollectionPoints,
  onManagePudo,
}: EstablishmentsTableProps) {
  const { isMobile } = useIsMobile();

  if (loading) {
    return <EstablishmentsTableLoading />;
  }

  // Mobile view for establishments
  if (isMobile) {
    return (
      <div className="space-y-4">
        {establishments.length === 0 ? (
          <EstablishmentsTableEmpty />
        ) : (
          establishments.map((establishment) => (
            <div 
              key={establishment.id}
              className="border rounded-md p-4 space-y-3 bg-card"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{establishment.name}</h3>
                  <p className="text-sm text-muted-foreground">{establishment.type === 'public' ? 'Público' : 'Privado'}</p>
                </div>
                <div className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {establishment.collection_points_count} pontos
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  ID: {establishment.id.slice(0, 8)}
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onEdit(establishment)}
                    className="text-xs text-primary"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => onManageCollectionPoints(establishment)}
                    className="text-xs text-primary"
                  >
                    Pontos
                  </button>
                  {onManagePudo && (
                    <button 
                      onClick={() => onManagePudo(establishment)}
                      className="text-xs text-primary flex items-center gap-1"
                    >
                      <Package className="h-3 w-3" />
                      PUDO
                    </button>
                  )}
                  <button 
                    onClick={() => onDelete(establishment)}
                    className="text-xs text-destructive"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  // Desktop view
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
                onManagePudo={onManagePudo}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
