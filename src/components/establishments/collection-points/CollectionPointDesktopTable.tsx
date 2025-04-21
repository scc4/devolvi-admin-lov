
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2, Check, X, Phone, ListCollapse } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { formatOperatingHours } from "./utils/formatters";
import { maskPhoneBR } from "@/lib/format";

interface CollectionPointDesktopTableProps {
  collectionPoints: CollectionPoint[];
  onEdit: (point: CollectionPoint) => void;
  onDelete: (pointId: string) => void;
}

export function CollectionPointDesktopTable({
  collectionPoints,
  onEdit,
  onDelete,
}: CollectionPointDesktopTableProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Horários</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collectionPoints.map((point) => (
              <TableRow key={point.id}>
                <TableCell>{point.name}</TableCell>
                <TableCell>
                  {point.phone ? (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{maskPhoneBR(point.phone)}</span>
                    </div>
                  ) : (
                    "Não informado"
                  )}
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ListCollapse className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="text-sm">
                        {formatOperatingHours(point.operating_hours)}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  {point.is_active ? (
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Ativo</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <X className="h-4 w-4 text-destructive" />
                      <span>Inativo</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(point)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(point.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
