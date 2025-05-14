
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

    console.log("Function called with request URL:", req.url);
    
    // Parse URL parameters
    const url = new URL(req.url);
    const establishmentId = url.searchParams.get('establishmentId');
    const carrierId = url.searchParams.get('carrierId');
    const fetchUnassigned = url.searchParams.get('fetchUnassigned') === 'true';
    const cityFilter = url.searchParams.get('cityFilter');
    
    console.log("Processing request with parameters:", { establishmentId, carrierId, fetchUnassigned, cityFilter });

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build and execute the query
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
    
    console.log(`Successfully fetched ${data?.length || 0} collection points`);

    // Transform the data to properly map address data to address_obj
    const transformedData = data.map(point => {
      const pointId = point.id;
      console.log(`Processing point ${pointId}, original data:`, JSON.stringify(point));
      
      // Extract address data
      const addressData = point.address;
      console.log(`Address data for point ${pointId}:`, addressData);
      
      // Create the transformed point with address_obj
      const transformedPoint = {
        ...point,
        address_obj: addressData
      };
      
      // Log transformed point to ensure all data is correct
      console.log(`Transformed point ${pointId}:`, {
        id: transformedPoint.id,
        name: transformedPoint.name,
        address_id: transformedPoint.address_id,
        address_obj_present: transformedPoint.address_obj ? 'yes' : 'no',
        address_obj_sample: transformedPoint.address_obj ? {
          city: transformedPoint.address_obj.city,
          state: transformedPoint.address_obj.state
        } : null
      });
      
      return transformedPoint;
    });

    console.log(`Returning ${transformedData.length} transformed collection points`);

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
