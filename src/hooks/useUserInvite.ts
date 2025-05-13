
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRow } from "@/types/user";
import { userAdapter } from "@/adapters/users/userAdapter";

export function useUserInvite() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const sendInvite = async (form: { name: string, email: string, phone?: string, role: "admin" | "owner" }) => {
    setIsLoading(true);
    try {
      console.log("Sending invite to:", form.email);
      
      // Step 1: Create user with service role through admin-invite-user function
      const { data: inviteData, error: inviteFnError } = await supabase.functions.invoke('admin-invite-user', {
        body: { 
          email: form.email,
          userData: {
            name: form.name,
            phone: form.phone
          },
          role: form.role
        }
      });

      if (inviteFnError) {
        console.error("Error in admin-invite-user function:", inviteFnError);
        throw inviteFnError;
      }

      if (!inviteData?.user?.id) {
        console.error("No user ID returned from invitation:", inviteData);
        throw new Error("Falha ao criar usuário. Tente novamente.");
      }

      // Step 2: Send welcome email with the invite link
      const { error: emailError } = await supabase.functions.invoke('send-invite', {
        body: { 
          email: form.email, 
          name: form.name,
          inviteUrl: inviteData.url
        }
      });

      if (emailError) {
        console.error("Error sending email:", emailError);
        toast({ 
          title: "Usuário criado, mas email não enviado", 
          description: "O usuário foi criado mas houve um problema ao enviar o email de convite.",
          variant: "default" 
        });
      }

      toast({ title: "Convite enviado!", description: "O usuário receberá um email para completar o cadastro." });
      return { success: true, userId: inviteData.user?.id };
    } catch (error: any) {
      console.error("Error in sendInvite:", error);
      toast({
        title: "Erro ao enviar convite",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const resendInvite = async (user: UserRow) => {
    setIsLoading(true);
    try {
      if (!user.email) throw new Error("Email do usuário não encontrado");

      // Use the admin-invite-user function to generate a new invitation
      const { data: inviteData, error: inviteFnError } = await supabase.functions.invoke('admin-invite-user', {
        body: { 
          email: user.email,
          userData: {
            name: user.name,
          },
          role: user.role
        }
      });

      if (inviteFnError) throw inviteFnError;

      // Send email with the invitation URL
      const { error: emailError } = await supabase.functions.invoke('send-invite', {
        body: { 
          email: user.email, 
          name: user.name || 'Usuário',
          inviteUrl: inviteData.url
        }
      });

      if (emailError) throw emailError;

      toast({ title: "Convite reenviado!", description: "Um novo email de convite foi enviado." });
      return { success: true };
    } catch (error: any) {
      console.error("Error in resendInvite:", error);
      toast({
        title: "Erro ao reenviar convite",
        description: error?.message || "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendInvite,
    resendInvite,
    isLoading
  };
}
