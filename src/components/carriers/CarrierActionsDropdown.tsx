
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Ban, MoreVertical } from "lucide-react";
import type { Carrier } from "@/types/carrier";

interface CarrierActionsDropdownProps {
  carrier: Carrier;
  onEdit: (carrier: Carrier) => void;
  onDelete: (carrier: Carrier) => void;
  onDeactivate: (carrier: Carrier) => void;
}

export function CarrierActionsDropdown({
  carrier,
  onEdit,
  onDelete,
  onDeactivate,
}: CarrierActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem onClick={() => onEdit(carrier)} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          <span>Editar</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(carrier)} className="cursor-pointer text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          <span>Excluir</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDeactivate(carrier)} className="cursor-pointer">
          <Ban className="mr-2 h-4 w-4" />
          <span>Desativar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
