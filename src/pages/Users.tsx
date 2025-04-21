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
import { useAuth } from "@/context/AuthContext";

// Lista de perfis permitidos
const ROLES = [
  { value: "owner", label: "Proprietário" },
  { value: "admin", label: "Administrador" },
  { value: "carrier", label: "Transportador" },
  { value: "dropoff", label: "Ponto de Entrega" },
  { value: "user", label: "Usuário" },
] as const;

// Only allow admin and owner for edit/invite dialogs
type EditInviteRole = "admin" | "owner";

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
  const { user: currentUser, roles: currentUserRoles } = useAuth();
  const isAdmin = currentUserRoles.includes("admin") || currentUserRoles.includes("owner");
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Modais e ações
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [confirmModal, setConfirmModal] = useState<null | { action: "delete" | "deactivate" | "invite", user: UserRow }>(null);
  const { toast } = useToast();

  // Buscar usuários sem depender da API admin
  const loadUsers = async () => {
    setLoading(true);
    setPermissionError(null);
    try {
      // Tentativa de carregar usuários através da sessão atual e da API pública do Supabase

      // 1. Buscar todos os perfis disponíveis com telefone
      const { data: profiles, error: pfErr } = await supabase
        .from("profiles")
        .select("id, name, created_at, phone");

      if (pfErr) {
        console.error("Error fetching profiles:", pfErr);
        toast({ title: "Erro ao carregar perfis", description: pfErr.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      // 2. Buscar roles para os usuários
      const { data: roleData, error: rlErr } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rlErr) {
        console.error("Error fetching roles:", rlErr);
        toast({ title: "Erro ao carregar roles", description: rlErr.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      // 3. Buscar metadados de autenticação do usuário atual para obter emails
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserEmail = session?.user?.email;

      // Combinar os dados
      let userList: UserRow[] = [];
      
      // 4. Montar lista de usuários a partir dos perfis
      if (profiles) {
        for (const profile of profiles) {
          const roleRow = roleData?.find(r => r.user_id === profile.id);
          
          // Determinar o email para o usuário atual
          let email = null;
          if (profile.id === session?.user?.id) {
            email = currentUserEmail;
          }
          
          userList.push({
            id: profile.id,
            name: profile.name,
            email: email,  // somente temos acesso ao email do usuário atual
            phone: profile.phone,   // agora estamos armazenando o telefone
            created_at: profile.created_at,
            role: roleRow?.role ?? "user",
            status: "Ativo", // Assumindo que todos estão ativos
          });
        }
      }

      // 5. Buscar usuários que possam estar na tabela user_roles mas não tenham perfil
      if (roleData) {
        for (const role of roleData) {
          // Verificar se este usuário já está na lista
          const userExists = userList.some(u => u.id === role.user_id);
          
          if (!userExists) {
            // Este é um usuário com role, mas sem perfil
            userList.push({
              id: role.user_id,
              name: null,
              email: role.user_id === session?.user?.id ? currentUserEmail : null,
              phone: null,
              created_at: new Date().toISOString(), // Valor padrão
              role: role.role,
              status: "Ativo", // Assumindo que está ativo
            });
          }
        }
      }
      
      setUsers(userList);
    } catch (error: any) {
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

  // Funções de ações simplificadas para trabalhar sem admin API
  const handleInvite = async (form: { name: string, email: string, phone?: string, role: EditInviteRole }) => {
    toast({
      title: "Funcionalidade limitada",
      description: "O convite de usuários exige permissões de API administrativa que não estão disponíveis atualmente.",
      variant: "destructive"
    });
    setInviteOpen(false);
  };

  const handleEdit = async (userId: string, updates: { name: string, phone: string | null, role: EditInviteRole }) => {
    try {
      // Atualizar o perfil com o nome e telefone
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
            name: updates.name,
            phone: updates.phone // Agora atualizamos o telefone também
          })
        .eq("id", userId);
        
      if (profileError) {
        toast({ title: "Erro ao atualizar perfil", description: profileError.message, variant: "destructive" });
        return;
      }
      
      // Verificar primeiro se já existe um registro para este usuário
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .single();
      
      let roleError;
      
      if (existingRole) {
        // Se já existe, atualizar
        const { error } = await supabase
          .from("user_roles")
          .update({ role: updates.role })
          .eq("user_id", userId);
          
        roleError = error;
      } else {
        // Se não existe, inserir
        const { error } = await supabase
          .from("user_roles")
          .insert({ 
            user_id: userId,
            role: updates.role 
          });
          
        roleError = error;
      }
        
      if (roleError) {
        toast({ title: "Erro ao atualizar função", description: roleError.message, variant: "destructive" });
        return;
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
    toast({
      title: "Funcionalidade limitada",
      description: "A exclusão de usuários exige permissões de API administrativa que não estão disponíveis atualmente.",
      variant: "destructive"
    });
    setConfirmModal(null);
  };

  const handleDeactivate = async (user: UserRow) => {
    toast({
      title: "Funcionalidade limitada",
      description: "A inativação de usuários exige permissões de API administrativa que não estão disponíveis atualmente.",
      variant: "destructive"
    });
    setConfirmModal(null);
  };

  const handleResendInvite = async (user: UserRow) => {
    toast({
      title: "Funcionalidade limitada",
      description: "O reenvio de convites exige permissões de API administrativa que não estão disponíveis atualmente.",
      variant: "destructive"
    });
    setConfirmModal(null);
  };

  // Se o usuário não for admin ou owner, mostrar mensagem de acesso negado
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Acesso Negado</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Permissão necessária</AlertTitle>
              <AlertDescription>
                Você precisa ser administrador ou proprietário para acessar esta página.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            onClick={() => setInviteOpen(true)}
          >
            <UserPlus className="mr-2 h-4 w-4" /> Convidar Usuários
          </Button>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Funcionalidade limitada</AlertTitle>
            <AlertDescription>
              Algumas funcionalidades de gerenciamento de usuários exigem permissões de API administrativa que não estão disponíveis no momento.
              Você ainda pode visualizar usuários e editar nomes e funções.
            </AlertDescription>
          </Alert>
          
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
                      <TableCell>{user.phone ? formatPhoneBR(user.phone) : <span className="text-muted-foreground">—</span>}</TableCell>
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
                            disabled={true}
                            onClick={() => setConfirmModal({ action: "delete", user })}
                            title="Funcionalidade indisponível"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={true}
                            onClick={() => setConfirmModal({ action: "deactivate", user })}
                            title="Funcionalidade indisponível"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                          {user.status === "Convidado" && (
                            <Button
                              variant="secondary"
                              size="icon"
                              disabled={true}
                              onClick={() => setConfirmModal({ action: "invite", user })}
                              title="Funcionalidade indisponível"
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
      {editUser && (
        <EditDialog
          user={{
            id: editUser.id,
            name: editUser.name,
            phone: editUser.phone,
            // If admin or owner, pass as is; else default to admin
            role: editUser.role === "admin" || editUser.role === "owner" ? editUser.role : "admin",
          }}
          onClose={() => setEditUser(null)}
          onEdit={handleEdit}
        />
      )}
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
