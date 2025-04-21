
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRow } from "@/types/user";
import { useUserProfile } from './useUserProfile';
import { useUserRole } from './useUserRole';
import { useUserInvite } from './useUserInvite';
import { useUserManagement } from './useUserManagement';

export function useUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { handleEdit: handleProfileEdit } = useUserProfile();
  const { updateRole } = useUserRole();
  const { sendInvite, resendInvite } = useUserInvite();
  const { deleteUser, deactivateUser } = useUserManagement();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data: authUsers, error: authErr } = await supabase.auth.admin.listUsers();
      
      if (authErr) {
        console.error("Error fetching auth users:", authErr);
        toast({ title: "Erro ao carregar usuários", description: authErr.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      const { data: profiles, error: pfErr } = await supabase
        .from("profiles")
        .select("id, name, created_at, phone");

      if (pfErr) {
        console.error("Error fetching profiles:", pfErr);
        toast({ title: "Erro ao carregar perfis", description: pfErr.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      const { data: roleData, error: rlErr } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rlErr) {
        console.error("Error fetching roles:", rlErr);
        toast({ title: "Erro ao carregar roles", description: rlErr.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      let userList: UserRow[] = [];
      
      if (authUsers?.users) {
        for (const authUser of authUsers.users) {
          const profile = profiles?.find(p => p.id === authUser.id);
          const roleRow = roleData?.find(r => r.user_id === authUser.id);
          
          let status: "Ativo" | "Inativo" | "Convidado" = "Ativo";
          if (authUser.user_metadata?.disabled) {
            status = "Inativo";
          } else if (!authUser.email_confirmed_at) {
            status = "Convidado";
          }

          userList.push({
            id: authUser.id,
            name: profile?.name || null,
            email: authUser.email || null,
            phone: profile?.phone || null,
            created_at: profile?.created_at || authUser.created_at || new Date().toISOString(),
            role: roleRow?.role ?? "user",
            status: status,
          });
        }
      }
      
      setUsers(userList);
    } catch (error: any) {
      console.error("Unexpected error loading users:", error);
      toast({ 
        title: "Erro inesperado", 
        description: "Ocorreu um erro ao carregar os dados dos usuários.", 
        variant: "destructive" 
      });
    }
    setLoading(false);
  };

  const handleEdit = async (userId: string, updates: { name: string, phone: string | null, role: "admin" | "owner" }) => {
    try {
      const { success: profileSuccess } = await handleProfileEdit(userId, updates);
      if (!profileSuccess) return;

      const { success: roleSuccess } = await updateRole(userId, updates.role);
      if (!roleSuccess) return;

      toast({ title: "Usuário atualizado!", description: "Dados do usuário alterados com sucesso." });
      loadUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Erro ao atualizar usuário",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  const handleInvite = async (form: { name: string, email: string, phone?: string, role: "admin" | "owner" }) => {
    const { success } = await sendInvite(form);
    if (success) loadUsers();
  };

  const handleResendInvite = async (user: UserRow) => {
    const { success } = await resendInvite(user);
    if (success) loadUsers();
  };

  const handleDelete = async (user: UserRow) => {
    const { success } = await deleteUser(user);
    if (success) loadUsers();
  };

  const handleDeactivate = async (user: UserRow) => {
    const { success } = await deactivateUser(user);
    if (success) loadUsers();
  };

  return {
    users,
    loading,
    loadUsers,
    handleEdit,
    handleDelete,
    handleDeactivate,
    handleInvite,
    handleResendInvite
  };
}
