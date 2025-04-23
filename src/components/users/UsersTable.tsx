
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserActionsDropdown } from "@/components/users/UserActionsDropdown";
import { UserRow } from "@/types/user";

interface UsersTableProps {
  users: UserRow[];
  loading: boolean;
  onEdit: (user: UserRow) => void;
  onDelete: (user: UserRow) => void;
  onDeactivate: (user: UserRow) => void;
  onResendInvite: (user: UserRow) => void;
  onResetPassword: (user: UserRow) => void;
}

export function UsersTable({
  users,
  loading,
  onEdit,
  onDelete,
  onDeactivate,
  onResendInvite,
  onResetPassword
}: UsersTableProps) {
  return (
    <div className="relative bg-soft-purple rounded-lg">
      <Table>
        <TableHeader className="bg-primary/10">
          <TableRow>
            <TableHead className="text-primary font-semibold">Nome</TableHead>
            <TableHead className="text-primary font-semibold">Email</TableHead>
            <TableHead className="text-primary font-semibold">Status</TableHead>
            <TableHead className="text-right text-primary font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-4">Carregando...</TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-4">Nenhum usuário encontrado.</TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="hover:bg-primary/5 transition-colors">
                <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${user.status === 'Ativo' ? 'bg-soft-success text-green-700' : 
                        user.status === 'Inativo' ? 'bg-soft-danger text-red-700' : 
                        'bg-soft-warning text-amber-700'}
                    `}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <UserActionsDropdown
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDeactivate={onDeactivate}
                    onResendInvite={onResendInvite}
                    onResetPassword={onResetPassword}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
