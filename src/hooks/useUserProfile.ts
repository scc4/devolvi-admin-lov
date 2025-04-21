
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRow } from "@/types/user";

export function useUserProfile() {
  const { toast } = useToast();

  const handleEdit = async (userId: string, updates: { name: string, phone: string | null }) => {
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          name: updates.name, 
          phone: updates.phone 
        })
        .eq('id', userId);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  return {
    handleEdit,
  };
}
