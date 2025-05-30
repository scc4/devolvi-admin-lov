
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Ban, Mail, MoreVertical, Key } from "lucide-react";
import { UserRow } from "@/types/user";
import { useAuth } from "@/context/AuthContext";

interface UserActionsDropdownProps {
  user: UserRow;
  onEdit: (user: UserRow) => void;
  onDelete: (user: UserRow) => void;
  onDeactivate: (user: UserRow) => void;
  onResendInvite: (user: UserRow) => void;
  onResetPassword: (user: UserRow) => void;
}

export function UserActionsDropdown({
  user,
  onEdit,
  onDelete,
  onDeactivate,
  onResendInvite,
  onResetPassword,
}: UserActionsDropdownProps) {
  const { roles } = useAuth();
  const isOwner = roles.includes('owner');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          <span>Editar</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(user)} className="cursor-pointer text-destructive">
          <Trash className="mr-2 h-4 w-4" />
          <span>Excluir</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDeactivate(user)} className="cursor-pointer">
          <Ban className="mr-2 h-4 w-4" />
          <span>Inativar</span>
        </DropdownMenuItem>
        {user.status === "Convidado" && (
          <DropdownMenuItem onClick={() => onResendInvite(user)} className="cursor-pointer">
            <Mail className="mr-2 h-4 w-4" />
            <span>Reenviar convite</span>
          </DropdownMenuItem>
        )}
        {isOwner && (
          <DropdownMenuItem onClick={() => onResetPassword(user)} className="cursor-pointer">
            <Key className="mr-2 h-4 w-4" />
            <span>Alterar Senha</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
