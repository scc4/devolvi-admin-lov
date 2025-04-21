
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRow } from "@/types/user";

// Define the type for user data returned from admin.listUsers()
type UserData = {
  users?: {
    id: string;
    email?: string | null;
    // Add other properties as needed
  }[];
};

export function useUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
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

      // Buscar emails de todos usuários (usando admin API)
      const { data: userData, error: userErr } = await supabase.auth.admin.listUsers() as { 
        data: UserData | null;
        error: Error | null;
      };
      
      if (userErr) {
        console.error("Error fetching user emails:", userErr);
        toast({ title: "Erro ao carregar emails", description: userErr.message, variant: "destructive" });
      }
      
      let userList: UserRow[] = [];
      
      // Combinar dados dos perfis com as roles
      if (profiles) {
        for (const profile of profiles) {
          const roleRow = roleData?.find(r => r.user_id === profile.id);
          const userInfo = userData?.users?.find(u => u.id === profile.id);
          
          userList.push({
            id: profile.id,
            name: profile.name,
            email: userInfo?.email || null,
            phone: profile.phone,
            created_at: profile.created_at,
            role: roleRow?.role ?? "user",
            status: "Ativo",
          });
        }
      }

      // Adicionar usuários que têm role mas não têm perfil
      if (roleData) {
        for (const role of roleData) {
          const userExists = userList.some(u => u.id === role.user_id);
          
          if (!userExists) {
            const userInfo = userData?.users?.find(u => u.id === role.user_id);
            
            userList.push({
              id: role.user_id,
              name: null,
              email: userInfo?.email || null,
              phone: null,
              created_at: new Date().toISOString(),
              role: role.role,
              status: "Ativo",
            });
          }
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
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (checkError) throw checkError;
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ name: updates.name, phone: updates.phone })
        .eq('id', userId);

      if (profileError) throw profileError;

      let roleError;
      
      if (existingRole && existingRole.length > 0) {
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
