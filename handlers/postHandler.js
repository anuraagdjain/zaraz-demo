'use strict'

module.exports = async function(request, corsHeaders) {
  const body = await request.json()
  const res = new Response(`console.log('POST-received');`, {
    headers: {
      ...corsHeaders,
    },
  })
  const d = new Date()
  d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000) // 1 day cookie expiry
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
