const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') {
    return Response.json({ success: false, error: 'Method not allowed' }, { status: 405, headers: corsHeaders })
  }

  try {
    const { token, action = 'login' } = await request.json()
    if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
      return Response.json({ success: false, error: 'Invalid Turnstile token' }, { status: 400, headers: corsHeaders })
    }

    const secret = Deno.env.get('TURNSTILE_SECRET_KEY')
    if (!secret) {
      console.error('[verify-turnstile] TURNSTILE_SECRET_KEY is missing')
      return Response.json({ success: false, error: 'Turnstile is not configured' }, { status: 500, headers: corsHeaders })
    }

    const body = new URLSearchParams({ secret, response: token })
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(10000),
    })
    const result = await response.json()
    const allowedHostnames = (Deno.env.get('TURNSTILE_ALLOWED_HOSTNAMES') || '')
      .split(',').map((hostname) => hostname.trim()).filter(Boolean)
    const hostnameValid = allowedHostnames.length === 0 || allowedHostnames.includes(result.hostname)
    const valid = response.ok && result.success === true && result.action === action && hostnameValid

    if (!valid) {
      console.warn('[verify-turnstile] rejected token', {
        success: result.success,
        action: result.action,
        hostname: result.hostname,
        errorCodes: result['error-codes'],
      })
    }
    return Response.json({ success: valid }, { status: valid ? 200 : 403, headers: corsHeaders })
  } catch (error) {
    console.error('[verify-turnstile] validation error', error)
    return Response.json({ success: false, error: 'Turnstile validation failed' }, { status: 502, headers: corsHeaders })
  }
})
