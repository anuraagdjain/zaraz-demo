'use strict'

const config = require('./util/config')
const postHandler = require('./handlers/postHandler')
const getHandler = require('./handlers/getHandler')

const corsHeaders = {
  'Access-Control-Allow-Origin': config.frontendUrl,
  'Access-Control-Allow-Methods': 'OPTIONS, HEAD, POST, GET',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Credentials': true,
  Allow: 'GET, HEAD, POST, OPTIONS',
}

function handleOptions(request) {
  // Boilderplate code from https://developers.cloudflare.com/workers/examples/cors-header-proxy/
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  let headers = request.headers
  if (
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null
  ) {
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    let respHeaders = {
      ...corsHeaders,
    }
    return new Response(null, {
      headers: respHeaders,
    })
  } else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        ...corsHeaders,
      },
    })
  }
}

async function handleRequest(request) {
  let response
  if (request.method === 'OPTIONS') {
    response = handleOptions(request)
  } else {
    const requestMethod = request.method.toLowerCase()

    if (requestMethod === 'get') {
      return getHandler(request, corsHeaders)
    } else if (requestMethod === 'post') {
      return postHandler(request, corsHeaders)
    }
  }
  return response
}

addEventListener('fetch', event => {
  return event.respondWith(handleRequest(event.request))
})
