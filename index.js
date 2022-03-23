const cookie = require('cookie')

const config = require('./util/config')
const postHandler = require('./handlers/postHandler')

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
      const parsedCookies = cookie.parse(request.headers.get('Cookie') || '')
      console.log('ParsedCookies: ', JSON.stringify(parsedCookies))
      if (parsedCookies.name && parsedCookies.quote) {
        response = `
            console.log('cookie "name": ${parsedCookies.name}');
            console.log('cookie "quote": ${parsedCookies.quote}');
        `
        const res = new Response(response, {
          headers: {
            ...corsHeaders,
          },
        })
        res.headers.append(
          'set-cookie',
          `name=${parsedCookies.name};SameSite=None;`,
        )
        res.headers.append(
          'set-cookie',
          `quote=${parsedCookies.quote};SameSite=None;`,
        )
        return res
      } else {
        return new Response(
          `
            const URL = '${config.workerUrl}';
            var payload = JSON.stringify({ "name": name, "quote": quote });
            var xhr = new XMLHttpRequest();
            xhr.open("POST", URL, true);
            xhr.withCredentials = 'true';
            
            xhr.onreadystatechange = function () {
              // In local files, status is 0 upon success in Mozilla Firefox
              if(xhr.readyState === XMLHttpRequest.DONE) {
                var status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                  // The request has been completed successfully
                  console.log('Cloudflare worker executed');
                } else {
                  // Oh no! There has been an error with the request!
                  console.log('Something went wrong', xhr.response);
                }
              }
            };

            xhr.send(payload);`,
          {
            headers: {
              ...corsHeaders,
              'content-type': 'text/html',
            },
          },
        )
      }
    } else if (requestMethod === 'post') {
      return postHandler(request, corsHeaders)
    }
  }
  return response
}

addEventListener('fetch', event => {
  return event.respondWith(handleRequest(event.request))
})
