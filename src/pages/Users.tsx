import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InviteDialog } from "@/components/users/InviteDialog";
import { EditDialog } from "@/components/users/EditDialog";
import { ConfirmActionDialog } from "@/components/users/ConfirmActionDialog";
import { useAuth } from "@/context/AuthContext";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersSearch } from "@/components/users/UsersSearch";
import { UsersTable } from "@/components/users/UsersTable";

// Lista de perfis permitidos
export const ROLES = [
  { value: "owner", label: "Proprietário" },
  { value: "admin", label: "Administrador" },
  { value: "carrier", label: "Transportador" },
  { value: "dropoff", label: "Ponto de Entrega" },
  { value: "user", label: "Usuário" },
] as const;

type RoleValue = typeof ROLES[number]["value"];
type StatusType = "Ativo" | "Inativo" | "Convidado";

export type UserRow = {
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
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [confirmModal, setConfirmModal] = useState<null | { action: "delete" | "deactivate" | "invite", user: UserRow }>(null);
  const { toast } = useToast();

  // Buscar usuários sem depender da API admin
  const loadUsers = async () => {
    setLoading(true);
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

  const handleInvite = async (form: { name: string, email: string, phone?: string, role: "admin" | "owner" }) => {
    try {
      // Enviar convite via Supabase Auth
      const { data, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(form.email, {
        data: {
          name: form.name,
          phone: form.phone
        }
      });

      if (inviteError) throw inviteError;

      // Adicionar role do usuário
      if (data?.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role: form.role });

        if (roleError) throw roleError;
      }

      toast({ title: "Convite enviado!", description: "O usuário receberá um email para completar o cadastro." });
      setInviteOpen(false);
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar convite",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = async (userId: string, updates: { name: string, phone: string | null, role: "admin" | "owner" }) => {
    try {
      // Atualizar perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name: updates.name, phone: updates.phone })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Atualizar role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: updates.role });

      if (roleError) throw roleError;

      toast({ title: "Usuário atualizado!", description: "Dados do usuário alterados com sucesso." });
      setEditUser(null);
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar usuário",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (user: UserRow) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      toast({ title: "Usuário excluído!", description: "O usuário foi removido com sucesso." });
      setConfirmModal(null);
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir usuário",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  const handleDeactivate = async (user: UserRow) => {
    try {
      // Desativar usuário no Auth - use banned_until with a far future date instead of banned property
      const farFutureDate = new Date('2099-12-31').toISOString();
      const { error } = await supabase.auth.admin.updateUserById(
        user.id,
        { banned_until: farFutureDate }
      );
      if (error) throw error;

      toast({ title: "Usuário inativado!", description: "O usuário foi inativado com sucesso." });
      setConfirmModal(null);
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao inativar usuário",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  const handleResendInvite = async (user: UserRow) => {
    try {
      if (!user.email) throw new Error("Email do usuário não encontrado");

      const { error } = await supabase.auth.admin.inviteUserByEmail(user.email);
      if (error) throw error;

      toast({ title: "Convite reenviado!", description: "Um novo email de convite foi enviado." });
      setConfirmModal(null);
    } catch (error: any) {
      toast({
        title: "Erro ao reenviar convite",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <UsersHeader onInvite={() => setInviteOpen(true)} />
        </CardHeader>
        <CardContent>
          <UsersSearch searchTerm={searchTerm} onSearch={setSearchTerm} />
          <UsersTable
            users={filteredUsers}
            loading={loading}
            onEdit={setEditUser}
            onDelete={(user) => setConfirmModal({ action: "delete", user })}
            onDeactivate={(user) => setConfirmModal({ action: "deactivate", user })}
            onResendInvite={(user) => setConfirmModal({ action: "invite", user })}
          />
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
