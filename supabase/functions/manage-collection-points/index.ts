
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

interface CollectionPointData {
  id?: string
  name: string
  address: string
  address_id?: string | null
  address_obj?: AddressData | null
  establishment_id?: string | null
  carrier_id?: string | null
  phone?: string | null
  is_active?: boolean
  operating_hours?: Record<string, Array<{open: string, close: string}>> | null
}

interface AddressData {
  id?: string
  street?: string | null
  number?: string | null
  complement?: string | null
  district?: string | null
  city?: string | null
  state?: string | null
  zip_code?: string | null
  latitude?: number | null
  longitude?: number | null
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Create Supabase client with the user's JWT for proper RLS
    const authHeader = req.headers.get('Authorization')
    const supabase = createClient(
      supabaseUrl,
      authHeader ? supabaseAnonKey : supabaseServiceKey,
      {
        global: {
          headers: {
            Authorization: authHeader || '',
          },
        },
      }
    )
    
    // Parse request body
    const { operation, data } = await req.json()
    console.log(`Executing operation: ${operation}`, data)
    
    switch (operation) {
      case 'get': 
        return await handleGetCollectionPoints(supabase, req.url)
      case 'create':
        return await handleCreateCollectionPoint(supabase, data)
      case 'update':
        return await handleUpdateCollectionPoint(supabase, data)
      case 'delete':
        return await handleDeleteCollectionPoint(supabase, data.id)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid operation' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleGetCollectionPoints(supabase, requestUrl) {
  try {
    const url = new URL(requestUrl)
    const establishmentId = url.searchParams.get('establishmentId')
    const carrierId = url.searchParams.get('carrierId')
    const fetchUnassigned = url.searchParams.get('fetchUnassigned') === 'true'
    const cityFilter = url.searchParams.get('cityFilter')
    
    console.log('Fetching collection points with params:', { 
      establishmentId, carrierId, fetchUnassigned, cityFilter 
    })
    
    let query = supabase
      .from('collection_points')
      .select(`
        *,
        address:address_id (*)
      `)
      .order('created_at', { ascending: false })
    
    if (establishmentId) {
      query = query.eq('establishment_id', establishmentId)
    }
    
    if (carrierId) {
      query = query.eq('carrier_id', carrierId)
    }
    
    if (fetchUnassigned) {
      query = query.is('carrier_id', null)
    }
    
    if (cityFilter && cityFilter.trim() !== '') {
      query = query.eq('address.city', cityFilter)
    }
    
    const { data: collectionPoints, error } = await query
    
    if (error) {
      console.error('Database error:', error)
      throw error
    }
    
    // Map address data for easier consumption
    const processedPoints = collectionPoints.map(point => ({
      ...point,
      address_obj: point.address
    }))
    
    console.log(`Fetched ${processedPoints.length} collection points`)
    
    return new Response(
      JSON.stringify(processedPoints),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error getting collection points:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleCreateCollectionPoint(supabase, pointData: CollectionPointData) {
  try {
    console.log('Creating collection point:', pointData)
    
    // Handle address creation if address_obj is provided
    let addressId = pointData.address_id
    if (pointData.address_obj && !addressId) {
      const { data: addressData, error: addressError } = await supabase
        .from('address')
        .insert({
          street: pointData.address_obj.street || null,
          number: pointData.address_obj.number || null,
          complement: pointData.address_obj.complement || null,
          district: pointData.address_obj.district || null,
          city: pointData.address_obj.city || null,
          state: pointData.address_obj.state || null,
          zip_code: pointData.address_obj.zip_code || null,
          latitude: pointData.address_obj.latitude || null,
          longitude: pointData.address_obj.longitude || null
        })
        .select('id')
        .single()
      
      if (addressError) {
        console.error('Error creating address:', addressError)
        throw addressError
      }
      
      addressId = addressData.id
      console.log('Created address with ID:', addressId)
    }
    
    // Prepare collection point data without address_obj
    const { address_obj, ...cleanPointData } = pointData
    
    // Generate formatted address from address object
    let formattedAddress = 'Sem endereço'
    if (pointData.address_obj) {
      const { street, number, district, city, state } = pointData.address_obj
      const parts = [street, number, district, city, state].filter(Boolean)
      formattedAddress = parts.join(', ')
    }
    
    // Create collection point
    const { data, error } = await supabase
      .from('collection_points')
      .insert({
        ...cleanPointData,
        address: formattedAddress,
        address_id: addressId,
        is_active: pointData.is_active ?? true
      })
      .select('*, address:address_id(*)')
      .single()
    
    if (error) {
      console.error('Error creating collection point:', error)
      throw error
    }
    
    console.log('Created collection point:', data)
    
    return new Response(
      JSON.stringify({
        ...data,
        address_obj: data.address
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating collection point:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleUpdateCollectionPoint(supabase, pointData: CollectionPointData) {
  try {
    console.log('Updating collection point:', pointData)
    
    if (!pointData.id) {
      throw new Error('Collection point ID is required')
    }
    
    // Handle address update if address_obj is provided
    let addressId = pointData.address_id
    
    if (pointData.address_obj) {
      if (addressId) {
        // Update existing address
        const { error: addressError } = await supabase
          .from('address')
          .update({
            street: pointData.address_obj.street || null,
            number: pointData.address_obj.number || null,
            complement: pointData.address_obj.complement || null,
            district: pointData.address_obj.district || null,
            city: pointData.address_obj.city || null,
            state: pointData.address_obj.state || null,
            zip_code: pointData.address_obj.zip_code || null,
            latitude: pointData.address_obj.latitude || null,
            longitude: pointData.address_obj.longitude || null
          })
          .eq('id', addressId)
        
        if (addressError) {
          console.error('Error updating address:', addressError)
          throw addressError
        }
        
        console.log('Updated address with ID:', addressId)
      } else {
        // Create new address
        const { data: addressData, error: addressError } = await supabase
          .from('address')
          .insert({
            street: pointData.address_obj.street || null,
            number: pointData.address_obj.number || null,
            complement: pointData.address_obj.complement || null,
            district: pointData.address_obj.district || null,
            city: pointData.address_obj.city || null,
            state: pointData.address_obj.state || null,
            zip_code: pointData.address_obj.zip_code || null,
            latitude: pointData.address_obj.latitude || null,
            longitude: pointData.address_obj.longitude || null
          })
          .select('id')
          .single()
        
        if (addressError) {
          console.error('Error creating address:', addressError)
          throw addressError
        }
        
        addressId = addressData.id
        console.log('Created new address with ID:', addressId)
      }
    }
    
    // Generate formatted address from address object
    let formattedAddress = undefined
    if (pointData.address_obj) {
      const { street, number, district, city, state } = pointData.address_obj
      const parts = [street, number, district, city, state].filter(Boolean)
      formattedAddress = parts.join(', ')
    }
    
    // Prepare collection point data for update (without address_obj)
    const { address_obj, id, ...updateData } = pointData
    
    // Update collection point
    const updatePayload = {
      ...updateData,
      address_id: addressId,
      ...(formattedAddress ? { address: formattedAddress } : {})
    }
    
    console.log('Updating collection point with data:', updatePayload)
    
    const { data, error } = await supabase
      .from('collection_points')
      .update(updatePayload)
      .eq('id', id)
      .select('*, address:address_id(*)')
      .single()
    
    if (error) {
      console.error('Error updating collection point:', error)
      throw error
    }
    
    console.log('Updated collection point:', data)
    
    return new Response(
      JSON.stringify({
        ...data,
        address_obj: data.address
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error updating collection point:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleDeleteCollectionPoint(supabase, pointId: string) {
  try {
    console.log('Deleting collection point:', pointId)
    
    // Get the address_id before deletion
    const { data: point } = await supabase
      .from('collection_points')
      .select('address_id')
      .eq('id', pointId)
      .single()
    
    const addressId = point?.address_id
    
    // Delete the collection point
    const { error } = await supabase
      .from('collection_points')
      .delete()
      .eq('id', pointId)
    
    if (error) {
      console.error('Error deleting collection point:', error)
      throw error
    }
    
    // Check if the address is used by other collection points
    if (addressId) {
      const { data: otherPoints } = await supabase
        .from('collection_points')
        .select('id')
        .eq('address_id', addressId)
      
      // If no other points use this address, delete it
      if (!otherPoints?.length) {
        await supabase
          .from('address')
          .delete()
          .eq('id', addressId)
        
        console.log('Deleted unused address:', addressId)
      }
    }
    
    console.log('Successfully deleted collection point:', pointId)
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error deleting collection point:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
