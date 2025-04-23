
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Phone, ListCollapse, Check, X } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { formatOperatingHours } from "../utils/formatters";
import { maskPhoneBR } from "@/lib/format";
import { CollectionPointActionsDropdown } from "../CollectionPointActionsDropdown";

interface CollectionPointDesktopViewProps {
  collectionPoints: CollectionPoint[];
  onEdit: (point: CollectionPoint) => void;
  onDelete: (pointId: string) => void;
  onAssignCarrier: (pointId: string, carrierId: string | null) => Promise<void>;
  carrierMap: Map<string, { name: string }>;
}

export function CollectionPointDesktopView({
  collectionPoints,
  onEdit,
  onDelete,
  onAssignCarrier,
  carrierMap,
}: CollectionPointDesktopViewProps) {
  const getSimpleAddress = (point: CollectionPoint) => {
    const parts = [];
    if (point.street) parts.push(point.street);
    if (point.number) parts.push(point.number);
    return parts.length > 0 ? parts.join(', ') : 'Não informado';
  };

  const getLocation = (point: CollectionPoint) => {
    const parts = [];
    if (point.city) parts.push(point.city);
    if (point.state) parts.push(point.state);
    return parts.length > 0 ? parts.join('/') : 'Não informado';
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Cidade/UF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Transportadora</TableHead>
              <TableHead>Horários</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collectionPoints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum ponto de coleta encontrado</p>
                </TableCell>
              </TableRow>
            ) : (
              collectionPoints.map((point) => (
                <TableRow key={point.id}>
                  <TableCell>{point.name}</TableCell>
                  <TableCell>{getSimpleAddress(point)}</TableCell>
                  <TableCell>{getLocation(point)}</TableCell>
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
                        <Button variant="ghost" size="icon">
                          <ListCollapse className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="flex flex-col space-y-1">
                          {formatOperatingHours(point.operating_hours).split('\n').map((line, index) => (
                            <div key={index} className="text-sm">
                              <span>{line}</span>
                            </div>
                          ))}
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
                    <CollectionPointActionsDropdown 
                      point={point}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onAssignCarrier={onAssignCarrier}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
