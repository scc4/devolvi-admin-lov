
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Modernize Admin <onboarding@resend.dev>",
      to: [email],
      subject: "Convite para Modernize Admin",
      html: `
        <h1>Olá ${name}!</h1>
        <p>Você foi convidado para acessar o Modernize Admin.</p>
        <p>Clique no link abaixo para criar sua conta:</p>
        <p><a href="${Deno.env.get("SUPABASE_URL")}/auth/v1/verify">Aceitar Convite</a></p>
        <p>Se você não solicitou este convite, pode ignorar este email.</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error sending invite email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
