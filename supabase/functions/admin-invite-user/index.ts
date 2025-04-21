
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Set up CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteUserRequest {
  email: string;
  userData?: {
    name?: string;
    phone?: string;
  };
  role: "admin" | "owner";
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { email, userData, role }: InviteUserRequest = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    );

    // Create the user with admin privileges
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      { data: userData }
    );

    if (error) {
      console.error('Error inviting user:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If user was created, assign the specified role
    if (data.user) {
      const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: data.user.id, role });

      if (roleError) {
        console.error('Error setting user role:', roleError);
        // Don't fail the whole operation if just the role assignment fails
        // We'll log it but continue
      }
    }

    return new Response(
      JSON.stringify({
        user: data.user,
        url: data.user ? data.properties?.action_link : null
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-invite-user function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
