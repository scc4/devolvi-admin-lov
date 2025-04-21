
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRow } from "@/types/user";

export function useUserManagement() {
  const { toast } = useToast();

  const deleteUser = async (user: UserRow) => {
    try {
      // Call our edge function with service role key
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId: user.id }
      });

      if (error) throw error;
      
      if (data?.success) {
        toast({
          title: "Usuário excluído",
          description: "O usuário foi excluído com sucesso."
        });
        return { success: true };
      } else {
        throw new Error(data?.error || 'Erro desconhecido');
      }
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
      // Call our edge function with service role key
      const { data, error } = await supabase.functions.invoke('admin-deactivate-user', {
        body: { userId: user.id }
      });

      if (error) throw error;
      
      if (data?.success) {
        toast({
          title: "Usuário inativado",
          description: "O usuário foi inativado com sucesso."
        });
        return { success: true };
      } else {
        throw new Error(data?.error || 'Erro desconhecido');
      }
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
