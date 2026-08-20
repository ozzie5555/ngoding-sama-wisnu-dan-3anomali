import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const response = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, { status, headers: corsHeaders })

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return response({ success: false, error: 'Method not allowed' }, 405)

  const authorization = request.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return response({ success: false, error: 'Authentication required' }, 401)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error('[delete-account] Supabase secrets are missing')
    return response({ success: false, error: 'Delete service is not configured' }, 500)
  }

  try {
    const accessToken = authorization.replace('Bearer ', '')
    const userClient = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
    const { data: { user }, error: userError } = await userClient.auth.getUser(accessToken)
    if (userError || !user) return response({ success: false, error: 'Invalid session' }, 401)

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // Remove uploaded item photos and profile avatar before deleting database rows.
    const { data: donationItems } = await admin
      .from('donation_items')
      .select('storage_path, donations!inner(donor_id)')
      .eq('donations.donor_id', user.id)
    const itemPaths = (donationItems || [])
      .map((item) => item.storage_path)
      .filter(Boolean)
    if (itemPaths.length > 0) {
      const { error: itemPhotoError } = await admin.storage.from('item-photos').remove(itemPaths)
      if (itemPhotoError) console.warn('[delete-account] item photo cleanup failed', itemPhotoError)
    }
    const { data: profilePhotoFiles } = await admin.storage
      .from('profile-photos')
      .list(user.id, { limit: 100 })
    const profilePaths = (profilePhotoFiles || []).map((file) => file.name ? user.id + '/' + file.name : null).filter(Boolean)
    if (profilePaths.length > 0) {
      const { error: profilePhotoError } = await admin.storage.from('profile-photos').remove(profilePaths)
      if (profilePhotoError) console.warn('[delete-account] profile photo cleanup failed', profilePhotoError)
    }

    // Donations use ON DELETE RESTRICT, so remove the donor's records first.
    const { error: donationError } = await admin
      .from('donations')
      .delete()
      .eq('donor_id', user.id)
    if (donationError) throw donationError

    // profiles -> profile_settings and other user-owned rows use ON DELETE CASCADE.
    const { error: profileError } = await admin
      .from('profiles')
      .delete()
      .eq('id', user.id)
    if (profileError) throw profileError

    const { error: authError } = await admin.auth.admin.deleteUser(user.id)
    if (authError) throw authError

    return response({ success: true })
  } catch (error) {
    console.error('[delete-account] deletion failed', error)
    return response({ success: false, error: error instanceof Error ? error.message : 'Account deletion failed' }, 500)
  }
})
