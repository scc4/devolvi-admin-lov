
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Handle CORS preflight requests
function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Get URL parameters
    const url = new URL(req.url);
    const establishmentId = url.searchParams.get('establishmentId');
    const carrierId = url.searchParams.get('carrierId');
    const fetchUnassigned = url.searchParams.get('fetchUnassigned') === 'true';
    const cityFilter = url.searchParams.get('cityFilter');

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build the query based on parameters
    let query = supabase
      .from('collection_points')
      .select(`
        *,
        establishment:establishments(name),
        address:address(*)
      `);

    // Apply filters based on input parameters
    if (fetchUnassigned) {
      query = query.is('carrier_id', null);
      
      if (cityFilter) {
        query = query.eq('address.city', cityFilter);
      }
    } else if (establishmentId) {
      query = query.eq('establishment_id', establishmentId);
    } else if (carrierId) {
      query = query.eq('carrier_id', carrierId);
    }
    
    // Execute the query
    const { data, error } = await query.order('name');

    if (error) {
      console.error("Error fetching collection points:", error);
      throw error;
    }

    // Transform the data to match the frontend's expected format
    // This is where we properly map the address data to address_obj
    const transformedData = data.map(point => {
      // Transform operating hours into the expected format
      const operatingHours = transformOperatingHours(point.operating_hours);
      
      return {
        ...point,
        operating_hours: operatingHours,
        // Explicitly map address to address_obj to ensure consistency
        address_obj: point.address
      };
    });

    // Return the transformed data
    return new Response(JSON.stringify(transformedData), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    });
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    });
  }
});

// Helper function to transform operating hours from Json to expected type
function transformOperatingHours(hours: any): any {
  if (!hours) return null;
  
  // Convert from Json to our expected type format
  const result: { [day: string]: { open: string; close: string }[] } = {};
  
  if (typeof hours === 'object' && hours !== null && !Array.isArray(hours)) {
    Object.entries(hours).forEach(([day, periods]) => {
      if (Array.isArray(periods)) {
        result[day] = periods.map(period => {
          // Ensure each period has open and close properties
          if (typeof period === 'object' && period !== null && 'open' in period && 'close' in period) {
            return {
              open: String(period.open),
              close: String(period.close)
            };
          }
          // Default values if structure is unexpected
          return { open: "09:00", close: "17:00" };
        });
      }
    });
  }
  
  return Object.keys(result).length > 0 ? result : null;
}
