
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPhoneBR } from "@/lib/format";
import { UserRow, ROLES } from "@/types/user";
import { UserActionsDropdown } from "./UserActionsDropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarDays, Mail, Phone, User } from "lucide-react";

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
  const { isMobile } = useIsMobile();

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">Nenhum usuário encontrado</p>
      </div>
    );
  }

  // Mobile view
  if (isMobile) {
    return (
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="border rounded-md p-4 bg-card">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium">{user.name || "—"}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 mr-1" />
                  <span>{user.email}</span>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                  ${user.status === "Ativo" && "bg-green-100 text-green-800"}
                  ${user.status === "Inativo" && "bg-gray-100 text-gray-800"}
                  ${user.status === "Convidado" && "bg-yellow-100 text-yellow-800"}
                `}
              >
                {user.status}
              </span>
            </div>
            
            <div className="space-y-1.5 mb-3">
              {user.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <span>{formatPhoneBR(user.phone)}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm">
                <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <span>{ROLES.find(r => r.value === user.role)?.label ?? user.role}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <span>Adicionado em {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex justify-end pt-2 border-t">
              <UserActionsDropdown
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
                onDeactivate={onDeactivate}
                onResendInvite={onResendInvite}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop view
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
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
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
              <TableCell className="text-right">
                <UserActionsDropdown
                  user={user}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDeactivate={onDeactivate}
                  onResendInvite={onResendInvite}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
