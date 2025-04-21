
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRow } from "@/types/user";

export function useUserManagement() {
  const { toast } = useToast();

  const deleteUser = async (user: UserRow) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      toast({ title: "Usuário excluído!", description: "O usuário foi removido com sucesso." });
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro ao excluir usuário",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const deactivateUser = async (user: UserRow) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { disabled: true } }
      );
      if (error) throw error;

      toast({ title: "Usuário inativado!", description: "O usuário foi inativado com sucesso." });
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro ao inativar usuário",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  return {
    deleteUser,
    deactivateUser,
  };
}
