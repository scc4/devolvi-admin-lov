
import { MoreHorizontal, Pencil, Trash, PowerOff, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Carrier } from "@/types/carrier";

interface CarrierActionsDropdownProps {
  carrier: Carrier;
  onEdit: (carrier: Carrier) => void;
  onDelete: (carrier: Carrier) => void;
  onDeactivate: (carrier: Carrier) => void;
  onManageCollectionPoints: (carrier: Carrier) => void;
}

export function CarrierActionsDropdown({ 
  carrier, 
  onEdit, 
  onDelete, 
  onDeactivate,
  onManageCollectionPoints
}: CarrierActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(carrier)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onManageCollectionPoints(carrier)}>
          <MapPin className="mr-2 h-4 w-4" />
          Pontos de Coleta
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {carrier.is_active && (
          <DropdownMenuItem onClick={() => onDeactivate(carrier)}>
            <PowerOff className="mr-2 h-4 w-4" />
            Desativar
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={() => onDelete(carrier)} 
          className="text-destructive focus:text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
