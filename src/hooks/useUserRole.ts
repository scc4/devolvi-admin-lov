
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRow } from "@/types/user";

export function useUserRole() {
  const { toast } = useToast();

  const updateRole = async (userId: string, role: "admin" | "owner") => {
    try {
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking existing role:", checkError);
        throw checkError;
      }

      let roleError;
      if (existingRole) {
        const { error } = await supabase
          .from('user_roles')
          .update({ role })
          .eq('user_id', userId);
        roleError = error;
      } else {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role });
        roleError = error;
      }

      if (roleError) {
        console.error("Error updating role:", roleError);
        throw roleError;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error updating role:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  return {
    updateRole,
  };
}
