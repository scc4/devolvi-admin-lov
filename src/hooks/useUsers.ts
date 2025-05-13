
import { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRow } from "@/types/user";
import { useUserProfile } from './useUserProfile';
import { useUserRole } from './useUserRole';
import { useUserInvite } from './useUserInvite';
import { useUserManagement } from './useUserManagement';
import { useAuth } from '@/context/AuthContext';

export function useUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { handleEdit: handleProfileEdit } = useUserProfile();
  const { updateRole } = useUserRole();
  const { sendInvite, resendInvite } = useUserInvite();
  const { deleteUser, deactivateUser } = useUserManagement();
  const { user: currentUser } = useAuth();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let userList: UserRow[] = [];
      
      // Get all users from auth.users via our edge function
      console.log("Fetching users from admin-list-users function");
      const { data: usersData, error: usersErr } = await supabase.functions.invoke('admin-list-users');
      
      if (usersErr) {
        console.error("Error fetching users:", usersErr);
        toast({ 
          title: "Erro ao carregar usuários", 
          description: usersErr.message || "Falha ao carregar usuários. Tente novamente mais tarde.", 
          variant: "destructive" 
        });
        setLoading(false);
        return;
      }

      if (!usersData || !usersData.users) {
        console.error("Invalid response from admin-list-users function");
        toast({ 
          title: "Erro ao carregar usuários", 
          description: "Resposta inválida da função de listar usuários", 
          variant: "destructive" 
        });
        setLoading(false);
        return;
      }

      // Attempt to fetch profiles and roles, but continue without them if they fail
      let profiles = [];
      try {
        const { data: profilesData, error: pfErr } = await supabase
          .from("profiles")
          .select("id, name, created_at, phone");
        
        if (pfErr) {
          console.error("Error fetching profiles:", pfErr);
          // Continue without profiles data
        } else {
          profiles = profilesData || [];
        }
      } catch (err) {
        console.error("Exception fetching profiles:", err);
        // Continue without profiles data
      }
      
      let roleData = [];
      try {
        const { data: rolesData, error: rlErr } = await supabase
          .from("user_roles")
          .select("user_id, role");
        
        if (rlErr) {
          console.error("Error fetching roles:", rlErr);
          // Continue without role data
        } else {
          roleData = rolesData || [];
        }
      } catch (err) {
        console.error("Exception fetching roles:", err);
        // Continue without role data
      }

      // Build complete user list by combining data from all sources
      userList = usersData.users.map((authUser: any) => {
        const profile = profiles?.find((p: any) => p.id === authUser.id);
        const roleRow = roleData?.find((r: any) => r.user_id === authUser.id);
        
        let status: "Ativo" | "Inativo" | "Convidado" = "Ativo";
        if (authUser.user_metadata?.disabled) {
          status = "Inativo";
        } else if (!authUser.email_confirmed_at) {
          status = "Convidado";
        }

        return {
          id: authUser.id,
          name: profile?.name || authUser.user_metadata?.name || null,
          email: authUser.email || null,
          phone: profile?.phone || null,
          created_at: profile?.created_at || authUser.created_at || new Date().toISOString(),
          role: roleRow?.role ?? "user",
          status: status,
        };
      });
      
      setUsers(userList);
    } catch (error: any) {
      console.error("Unexpected error loading users:", error);
      setError(error?.message || "Ocorreu um erro desconhecido");
      toast({ 
        title: "Erro inesperado", 
        description: "Ocorreu um erro ao carregar os dados dos usuários. Tente novamente mais tarde.", 
        variant: "destructive" 
      });
    }
    setLoading(false);
  }, [toast]);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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
    error,
    loadUsers,
    handleEdit,
    handleDelete,
    handleDeactivate,
    handleInvite,
    handleResendInvite
  };
}
