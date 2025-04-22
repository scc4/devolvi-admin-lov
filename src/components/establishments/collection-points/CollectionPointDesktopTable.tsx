
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Phone, ListCollapse, Check, X } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { formatOperatingHours } from "./utils/formatters";
import { maskPhoneBR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { CollectionPointActionsDropdown } from "./CollectionPointActionsDropdown";
import { useCarriers } from "@/hooks/useCarriers";
import { useState, useMemo } from "react";

interface CollectionPointDesktopTableProps {
  collectionPoints: CollectionPoint[];
  onEdit: (point: CollectionPoint) => void;
  onDelete: (pointId: string) => void;
  onAssignCarrier: (pointId: string, carrierId: string | null) => Promise<void>;
}

export function CollectionPointDesktopTable({
  collectionPoints,
  onEdit,
  onDelete,
  onAssignCarrier,
}: CollectionPointDesktopTableProps) {
  const { carriers } = useCarriers();
  
  const carrierMap = useMemo(() => {
    return new Map(carriers.map(carrier => [carrier.id, carrier]));
  }, [carriers]);

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Transportadora</TableHead>
              <TableHead>Horários</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
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
                  <CollectionPointActionsDropdown 
                    point={point}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAssignCarrier={onAssignCarrier}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
