
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, UsersIcon, Edit, Trash, Ban, Mail, UserPlus, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InviteDialog } from "@/components/users/InviteDialog";
import { EditDialog } from "@/components/users/EditDialog";
import { ConfirmActionDialog } from "@/components/users/ConfirmActionDialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatPhoneBR } from "@/lib/format";

// Lista de perfis permitidos
const ROLES = [
  { value: "owner", label: "Proprietário" },
  { value: "admin", label: "Administrador" },
  { value: "carrier", label: "Transportador" },
  { value: "dropoff", label: "Ponto de Entrega" },
  { value: "user", label: "Usuário" },
] as const;

type RoleValue = typeof ROLES[number]["value"];
type StatusType = "Ativo" | "Inativo" | "Convidado";

type UserRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  role: RoleValue;
  status: StatusType;
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Modais e ações
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [confirmModal, setConfirmModal] = useState<null | { action: "delete" | "deactivate" | "invite", user: UserRow }>(null);
  const { toast } = useToast();

  // Buscar usuários do Supabase
  const loadUsers = async () => {
    setLoading(true);
    setPermissionError(null);
    try {
      // Perfis
      const { data: profiles, error: pfErr } = await supabase
        .from("profiles")
        .select("id, name, created_at");

      if (pfErr) {
        console.error("Error fetching profiles:", pfErr);
        toast({ title: "Erro ao carregar perfis", description: pfErr.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      // E-mails e roles
      const { data: roles, error: rlErr } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rlErr) {
        console.error("Error fetching roles:", rlErr);
        toast({ title: "Erro ao carregar roles", description: rlErr.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      // Check if we can access admin APIs
      let authUsers: any[] = [];
      try {
        const { data: authList, error: auErr } = await supabase.auth.admin.listUsers();
        
        if (auErr) {
          console.error("Error fetching users:", auErr);
          setHasAdminAccess(false);
          setPermissionError("Não foi possível acessar detalhes dos usuários. Verificar permissões de administrador.");
        } else {
          setHasAdminAccess(true);
          // Type safety for authList
          authUsers = authList?.users || [];
        }
      } catch (err) {
        console.error("Admin API access error:", err);
        setHasAdminAccess(false);
        setPermissionError("Não foi possível acessar detalhes dos usuários. Verificar permissões de administrador.");
      }

      // Combinar os dados
      let userList: UserRow[] = [];
      if (profiles) {
        for (const profile of profiles) {
          const roleRow = roles?.find(r => r.user_id === profile.id);
          
          // Find user auth data if available
          const userAuth = authUsers.find(u => u.id === profile.id);
          
          // Exemplo de lógica simplificada de status:
          let status: StatusType = "Convidado";
          let email = null;
          let phone = null;
          
          if (userAuth) {
            email = userAuth.email || null;
            phone = userAuth.phone || null;
            
            // Use type assertion to safely check ban status
            const banned = userAuth.banned_until !== null && userAuth.banned_until !== undefined;
            if (banned) {
              status = "Inativo";
            } else if (userAuth.email_confirmed_at) {
              status = "Ativo";
            }
          }
          
          userList.push({
            id: profile.id,
            name: profile.name,
            email: email,
            phone: formatPhoneBR(phone),
            created_at: profile.created_at,
            role: roleRow?.role ?? "user",
            status,
          });
        }
      }
      setUsers(userList);
    } catch (error) {
      console.error("Unexpected error loading users:", error);
      toast({ title: "Erro inesperado", description: "Ocorreu um erro ao carregar os dados dos usuários.", variant: "destructive" });
    }
    setLoading(false);
  };
  
  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.includes(searchTerm)
  );

  // Funções de ações
  const handleInvite = async (form: { name: string, email: string, phone?: string, role: RoleValue }) => {
    if (!hasAdminAccess) {
      toast({
        title: "Permissão negada",
        description: "Você não tem permissão para convidar usuários. Verifique as permissões de administrador.",
        variant: "destructive"
      });
      return;
    }
    
    // Registrar usuário via signUp
    const { name, email, phone, role } = form;
    try {
      const { error, data } = await supabase.auth.admin.createUser({
        email,
        phone,
        email_confirm: false,
        user_metadata: { name, phone },
      });
      
      if (error) {
        toast({ title: "Erro ao convidar", description: error.message, variant: "destructive" });
        return;
      }
      
      // Atualizar perfil
      if (data.user) {
        await supabase.from("profiles").upsert({ 
          id: data.user.id, 
          name 
        });
        
        // Atribuir role
        await supabase.from("user_roles").upsert({ 
          user_id: data.user.id, 
          role 
        });
        
        toast({ title: "Convite enviado!", description: "O usuário foi convidado para a equipe." });
        
        // Recarregar usuários
        await loadUsers();
      }
    } catch (error: any) {
      console.error("Error inviting user:", error);
      toast({ 
        title: "Erro ao convidar usuário", 
        description: error?.message || "Ocorreu um erro inesperado. Verifique permissões de administrador.", 
        variant: "destructive" 
      });
    }
    setInviteOpen(false);
  };

  const handleEdit = async (userId: string, updates: { name: string, phone: string | null, role: RoleValue }) => {
    try {
      // Atualizar o perfil com o nome
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ name: updates.name })
        .eq("id", userId);
        
      if (profileError) {
        toast({ title: "Erro ao atualizar perfil", description: profileError.message, variant: "destructive" });
        return;
      }
      
      // Atualizar a role
      const { error: roleError } = await supabase
        .from("user_roles")
        .upsert({ 
          user_id: userId,
          role: updates.role 
        });
        
      if (roleError) {
        toast({ title: "Erro ao atualizar função", description: roleError.message, variant: "destructive" });
        return;
      }
      
      // Atualizar o phone no auth se tivermos acesso admin
      if (hasAdminAccess && updates.phone) {
        try {
          const { error: phoneError } = await supabase.auth.admin.updateUserById(userId, {
            phone: updates.phone
          });
          
          if (phoneError) {
            toast({ title: "Erro ao atualizar telefone", description: phoneError.message, variant: "destructive" });
          }
        } catch (error: any) {
          console.error("Error updating phone:", error);
          toast({ 
            title: "Erro ao atualizar telefone", 
            description: "Verificar permissões de administrador.", 
            variant: "destructive" 
          });
        }
      }
      
      toast({ title: "Usuário atualizado!", description: "Dados do usuário alterados com sucesso." });
      setEditUser(null);
      
      // Recarregar usuários
      await loadUsers();
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast({ 
        title: "Erro ao atualizar usuário", 
        description: error?.message || "Ocorreu um erro inesperado.", 
        variant: "destructive" 
      });
    }
  };

  const handleDelete = async (user: UserRow) => {
    if (!hasAdminAccess) {
      toast({
        title: "Permissão negada",
        description: "Você não tem permissão para excluir usuários. Verifique as permissões de administrador.",
        variant: "destructive"
      });
      setConfirmModal(null);
      return;
    }
    
    if (user.status === "Inativo") {
      toast({ title: "Ação inválida", description: "Não é possível excluir um usuário inativo.", variant: "destructive" });
      setConfirmModal(null);
      return;
    }
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (!error) {
        toast({ title: "Usuário excluído", description: "Usuário removido da equipe." });
        // Recarregar lista de usuários
        await loadUsers();
      } else {
        toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({ 
        title: "Erro ao excluir usuário", 
        description: error?.message || "Erro de permissão. Verifique permissões de administrador.", 
        variant: "destructive" 
      });
    }
    setConfirmModal(null);
  };

  const handleDeactivate = async (user: UserRow) => {
    if (!hasAdminAccess) {
      toast({
        title: "Permissão negada",
        description: "Você não tem permissão para inativar usuários. Verifique as permissões de administrador.",
        variant: "destructive"
      });
      setConfirmModal(null);
      return;
    }
    
    if (user.status === "Inativo") {
      toast({ title: "Usuário já está inativo.", variant: "destructive" });
      setConfirmModal(null);
      return;
    }
    
    try {
      // Use ban_duration instead of banned_until (which is not in the AdminUserAttributes type)
      const { error } = await supabase.auth.admin.updateUserById(user.id, {
        ban_duration: "87600h" // Ban for 10 years
      });
      
      if (!error) {
        toast({ title: "Usuário inativado", description: "O usuário foi marcado como inativo." });
        // Recarregar usuários
        await loadUsers();
      } else {
        toast({ title: "Erro ao inativar", description: error.message, variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Error deactivating user:", error);
      toast({ 
        title: "Erro ao inativar usuário", 
        description: error?.message || "Erro de permissão. Verifique permissões de administrador.", 
        variant: "destructive" 
      });
    }
    setConfirmModal(null);
  };

  const handleResendInvite = async (user: UserRow) => {
    if (!hasAdminAccess) {
      toast({
        title: "Permissão negada",
        description: "Você não tem permissão para reenviar convites. Verifique as permissões de administrador.",
        variant: "destructive"
      });
      setConfirmModal(null);
      return;
    }
    
    if (!user.email) {
      toast({ title: "Erro ao reenviar", description: "Usuário não possui email cadastrado", variant: "destructive" });
      setConfirmModal(null);
      return;
    }
    
    try {
      const { error } = await supabase.auth.admin.inviteUserByEmail(user.email);
      if (!error) {
        toast({ title: "Convite reenviado", description: "Novo convite enviado para o e-mail." });
      } else {
        toast({ title: "Erro ao reenviar convite", description: error.message, variant: "destructive" });
      }
    } catch (error: any) {
      console.error("Error resending invitation:", error);
      toast({ 
        title: "Erro ao reenviar convite", 
        description: error?.message || "Erro de permissão. Verifique permissões de administrador.", 
        variant: "destructive" 
      });
    }
    setConfirmModal(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <UsersIcon className="mr-1 h-5 w-5 text-primary" />
            <CardTitle className="text-xl font-bold">Gerenciar Equipes</CardTitle>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90" 
            onClick={() => {
              if (!hasAdminAccess) {
                toast({
                  title: "Permissão negada",
                  description: "Você não tem permissão para convidar usuários. Verifique as permissões de administrador.",
                  variant: "destructive"
                });
                return;
              }
              setInviteOpen(true);
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Convidar Usuários
          </Button>
        </CardHeader>
        <CardContent>
          {permissionError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Erro de permissão</AlertTitle>
              <AlertDescription>
                {permissionError}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center mb-4">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Buscar usuários..."
                className="pl-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

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
                    <TableCell colSpan={8} className="text-center py-4">Carregando...</TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-xs">{user.id}</TableCell>
                      <TableCell className="">{user.name || <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell>{user.email || <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell>{user.phone || <span className="text-muted-foreground">—</span>}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{ROLES.find(r => r.value === user.role)?.label ?? user.role}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${user.status === "Ativo" && "bg-green-100 text-green-800"}
                          ${user.status === "Inativo" && "bg-gray-100 text-gray-800"}
                          ${user.status === "Convidado" && "bg-yellow-100 text-yellow-800"}
                        `}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={user.status === "Inativo"}
                            onClick={() => setEditUser(user)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            disabled={user.status === "Inativo" || !hasAdminAccess}
                            onClick={() => setConfirmModal({ action: "delete", user })}
                            title="Excluir"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={user.status === "Inativo" || !hasAdminAccess}
                            onClick={() => setConfirmModal({ action: "deactivate", user })}
                            title="Inativar"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                          {user.status === "Convidado" && (
                            <Button
                              variant="secondary"
                              size="icon"
                              disabled={!hasAdminAccess}
                              onClick={() => setConfirmModal({ action: "invite", user })}
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
                    <TableCell colSpan={8} className="text-center py-4">Nenhum usuário encontrado</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modais */}
      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} onInvite={handleInvite} />
      {editUser && <EditDialog user={editUser} onClose={() => setEditUser(null)} onEdit={handleEdit} />}
      {confirmModal && (
        <ConfirmActionDialog
          open={!!confirmModal}
          action={confirmModal.action}
          user={confirmModal.user}
          onCancel={() => setConfirmModal(null)}
          onConfirm={() => {
            if (!confirmModal) return;
            if (confirmModal.action === "delete") handleDelete(confirmModal.user);
            if (confirmModal.action === "deactivate") handleDeactivate(confirmModal.user);
            if (confirmModal.action === "invite") handleResendInvite(confirmModal.user);
          }}
        />
      )}
    </div>
  );
}
