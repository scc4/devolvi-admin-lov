import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRow } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Fetch all users from auth.users (admin API)
      const { data: authUsers, error: authErr } = await supabase.auth.admin.listUsers();
      
      if (authErr) {
        console.error("Error fetching auth users:", authErr);
        toast({ title: "Erro ao carregar usuários", description: authErr.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      // Buscar perfis
      const { data: profiles, error: pfErr } = await supabase
        .from("profiles")
        .select("id, name, created_at, phone");

      if (pfErr) {
        console.error("Error fetching profiles:", pfErr);
        toast({ title: "Erro ao carregar perfis", description: pfErr.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      // Buscar roles
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
      
      // Map all auth users with their profile and role information
      if (authUsers?.users) {
        for (const authUser of authUsers.users) {
          const profile = profiles?.find(p => p.id === authUser.id);
          const roleRow = roleData?.find(r => r.user_id === authUser.id);
          
          // Determine status based on user metadata
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
      // First update the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          name: updates.name, 
          phone: updates.phone 
        })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Then handle role update
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      let roleError;
      if (existingRole) {
        const { error } = await supabase
          .from('user_roles')
          .update({ role: updates.role })
          .eq('user_id', userId);
        roleError = error;
      } else {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: updates.role });
        roleError = error;
      }

      if (roleError) throw roleError;

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

  const handleDelete = async (user: UserRow) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      toast({ title: "Usuário excluído!", description: "O usuário foi removido com sucesso." });
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
      const { error } = await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { disabled: true } }
      );
      if (error) throw error;

      toast({ title: "Usuário inativado!", description: "O usuário foi inativado com sucesso." });
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao inativar usuário",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  const handleInvite = async (form: { name: string, email: string, phone?: string, role: "admin" | "owner" }) => {
    try {
      const { data, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(form.email, {
        data: {
          name: form.name,
          phone: form.phone
        }
      });

      if (inviteError) throw inviteError;

      // Send invite email
      const { error: emailError } = await supabase.functions.invoke('send-invite', {
        body: { email: form.email, name: form.name }
      });

      if (emailError) throw emailError;

      if (data?.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role: form.role });

        if (roleError) throw roleError;
      }

      toast({ title: "Convite enviado!", description: "O usuário receberá um email para completar o cadastro." });
      loadUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar convite",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
  };

  const handleResendInvite = async (user: UserRow) => {
    try {
      if (!user.email) throw new Error("Email do usuário não encontrado");

      const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(user.email);
      if (inviteError) throw inviteError;

      // Resend invite email
      const { error: emailError } = await supabase.functions.invoke('send-invite', {
        body: { email: user.email, name: user.name || 'Usuário' }
      });

      if (emailError) throw emailError;

      toast({ title: "Convite reenviado!", description: "Um novo email de convite foi enviado." });
    } catch (error: any) {
      toast({
        title: "Erro ao reenviar convite",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
    }
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
