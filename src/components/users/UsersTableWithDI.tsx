
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { UserActionsDropdown } from "@/components/users/UserActionsDropdown";
import { UserDTO } from "@/application/dto/UserDTO";
import { userAdapter } from "@/adapters/users/userAdapter";

interface UsersTableWithDIProps {
  users: UserDTO[];
  loading: boolean;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onDeactivate: (user: any) => void;
  onResendInvite: (user: any) => void;
  onResetPassword: (user: any) => void;
}

export function UsersTableWithDI({
  users,
  loading,
  onEdit,
  onDelete,
  onDeactivate,
  onResendInvite,
  onResetPassword
}: UsersTableWithDIProps) {
  const { isMobile } = useIsMobile();
  
  // Convert DTOs to UI models for compatibility with existing components
  const userRows = userAdapter.toUIModelList(users);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (userRows.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
      </div>
    );
  }

  // Mobile view using cards
  if (isMobile) {
    return (
      <div className="space-y-4">
        {userRows.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
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
              </div>

              <div className="flex justify-end border-t pt-3">
                <UserActionsDropdown
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDeactivate={onDeactivate}
                  onResendInvite={onResendInvite}
                  onResetPassword={onResetPassword}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop view using table
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
          {userRows.map((user) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
