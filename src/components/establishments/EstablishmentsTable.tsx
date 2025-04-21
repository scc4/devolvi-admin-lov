
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2 } from "lucide-react";
import type { Establishment } from "@/types/establishment";

interface EstablishmentsTableProps {
  establishments: Array<Establishment & { collection_points_count: number }>;
  loading: boolean;
  onEdit: (establishment: Establishment) => void;
  onDelete: (establishment: Establishment) => void;
}

export function EstablishmentsTable({
  establishments,
  loading,
  onEdit,
  onDelete,
}: EstablishmentsTableProps) {
  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
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
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhum estabelecimento encontrado
              </TableCell>
            </TableRow>
          ) : (
            establishments.map((establishment) => (
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
