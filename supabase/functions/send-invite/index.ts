
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// Initialize Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  supabaseUrl || '',
  supabaseServiceRoleKey || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  }
);

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
    const { email, name, inviteUrl } = await req.json();
    
    if (!email || !name) {
      console.error("Missing required parameters:", { email, name });
      return new Response(
        JSON.stringify({ error: "Email and name are required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a custom sign-up URL with the invite token
    let signUpUrl = `${Deno.env.get("SUPABASE_URL") || ''}/auth/v1/verify`;
    
    // If a custom invite URL was provided, use it instead
    if (inviteUrl) {
      signUpUrl = inviteUrl;
    }

    const emailResponse = await resend.emails.send({
      from: "Modernize Admin <onboarding@resend.dev>",
      to: [email],
      subject: "Convite para Modernize Admin",
      html: `
        <h1>Olá ${name}!</h1>
        <p>Você foi convidado para acessar o Modernize Admin.</p>
        <p>Clique no link abaixo para criar sua conta:</p>
        <p><a href="${signUpUrl}">Aceitar Convite</a></p>
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
