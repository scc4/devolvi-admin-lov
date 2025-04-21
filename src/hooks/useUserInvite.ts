
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRow } from "@/types/user";

export function useUserInvite() {
  const { toast } = useToast();

  const sendInvite = async (form: { name: string, email: string, phone?: string, role: "admin" | "owner" }) => {
    try {
      const { data, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(form.email, {
        data: {
          name: form.name,
          phone: form.phone
        }
      });

      if (inviteError) throw inviteError;

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
      return { success: true, userId: data?.user?.id };
    } catch (error: any) {
      toast({
        title: "Erro ao enviar convite",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  const resendInvite = async (user: UserRow) => {
    try {
      if (!user.email) throw new Error("Email do usuário não encontrado");

      const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(user.email);
      if (inviteError) throw inviteError;

      const { error: emailError } = await supabase.functions.invoke('send-invite', {
        body: { email: user.email, name: user.name || 'Usuário' }
      });

      if (emailError) throw emailError;

      toast({ title: "Convite reenviado!", description: "Um novo email de convite foi enviado." });
      return { success: true };
    } catch (error: any) {
      toast({
        title: "Erro ao reenviar convite",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false, error };
    }
  };

  return {
    sendInvite,
    resendInvite,
  };
}
