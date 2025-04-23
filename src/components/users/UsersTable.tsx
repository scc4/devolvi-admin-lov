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
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Carregando...</TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Nenhum usuário encontrado.</TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">
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
