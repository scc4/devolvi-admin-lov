
import { MoreVertical, Pencil, Trash2, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { EstablishmentWithDetails } from "@/types/establishment";

interface EstablishmentActionsDropdownProps {
  establishment: EstablishmentWithDetails;
  onEdit: (establishment: EstablishmentWithDetails) => void;
  onDelete: (establishment: EstablishmentWithDetails) => void;
  onManageCollectionPoints: (establishment: EstablishmentWithDetails) => void;
}

export function EstablishmentActionsDropdown({ 
  establishment, 
  onEdit, 
  onDelete,
  onManageCollectionPoints
}: EstablishmentActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onEdit(establishment)}>
          <Pencil className="mr-2 h-4 w-4" />
          Editar Dados
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onManageCollectionPoints(establishment)}>
          <MapPin className="mr-2 h-4 w-4" />
          Pontos de Coleta
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => onDelete(establishment)} 
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
