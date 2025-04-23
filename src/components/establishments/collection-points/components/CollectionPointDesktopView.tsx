
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Clock, Edit, Trash2 } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { checkOpenStatus } from "../utils/checkOpenStatus";
import { formatOperatingHours } from "../utils/formatters";
import { getSimpleAddress, getLocation } from "../utils/addressHelpers";

interface CollectionPointDesktopViewProps {
  collectionPoints: CollectionPoint[];
  isLoading: boolean;
  onEdit?: (point: CollectionPoint) => void;
  onDelete?: (pointId: string) => void;
  carrierMap: Map<string, { name: string }>;
}

export function CollectionPointDesktopView({
  collectionPoints,
  isLoading,
  onEdit,
  onDelete,
  carrierMap
}: CollectionPointDesktopViewProps) {
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableCaption>Lista de pontos de coleta.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Cidade/UF</TableHead>
            <TableHead>Transportadora</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collectionPoints.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                Nenhum ponto de coleta encontrado.
              </TableCell>
            </TableRow>
          ) : (
            collectionPoints.map((point) => {
              const status = checkOpenStatus(point);
              return (
                <TableRow key={point.id}>
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
              )
            })
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              {collectionPoints.length} Ponto(s) de Coleta no total
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
