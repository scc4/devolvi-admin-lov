import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Ban, Mail } from "lucide-react";
import { formatPhoneBR } from "@/lib/format";
import { UserRow, ROLES } from "@/types/user";

interface UsersTableProps {
  users: UserRow[];
  loading: boolean;
  onEdit: (user: UserRow) => void;
  onDelete: (user: UserRow) => void;
  onDeactivate: (user: UserRow) => void;
  onResendInvite: (user: UserRow) => void;
}

export function UsersTable({
  users,
  loading,
  onEdit,
  onDelete,
  onDeactivate,
  onResendInvite,
}: UsersTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Data de Inclusão</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Carregando...
              </TableCell>
            </TableRow>
          ) : users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-mono text-xs">{user.id}</TableCell>
                <TableCell>{user.name || <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell>{user.email || <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell>{user.phone ? formatPhoneBR(user.phone) : <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{ROLES.find(r => r.value === user.role)?.label ?? user.role}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                      ${user.status === "Ativo" && "bg-green-100 text-green-800"}
                      ${user.status === "Inativo" && "bg-gray-100 text-gray-800"}
                      ${user.status === "Convidado" && "bg-yellow-100 text-yellow-800"}
                    `}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(user)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => onDelete(user)}
                      title="Excluir usuário"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeactivate(user)}
                      title="Inativar usuário"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                    {user.status === "Convidado" && (
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => onResendInvite(user)}
                        title="Reenviar convite"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Nenhum usuário encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
