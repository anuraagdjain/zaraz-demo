'use strict'

module.exports = async function(request, corsHeaders) {
  const body = await request.json()
  const headers = request.headers
  const ipAddress = headers.get('x-real-ip')
  const res = new Response(JSON.stringify({ ipAddress }), {
    headers: {
      ...corsHeaders,
    },
  })
  const d = new Date()
  d.setTime(d.getTime() + 10 * 24 * 60 * 60 * 1000) // 10 day cookie expiry
  const cookieExpiry = `expires=${d.toUTCString()}`

  res.headers.append(
    'set-cookie',
    `name=${body.name};SameSite=None;Secure;${cookieExpiry};`,
  )
  res.headers.append(
    'set-cookie',
    `quote=${body.quote};SameSite=None;Secure;${cookieExpiry};`,
  )
  return res
}
