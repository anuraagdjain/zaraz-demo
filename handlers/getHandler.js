const cookie = require('cookie')
const config = require('../util/config')

module.exports = function(request, corsHeaders) {
  const parsedCookies = cookie.parse(request.headers.get('Cookie') || '')

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
    response = `
            const URL = '${config.workerUrl}';
            const payload = JSON.stringify({ "name": name, "quote": quote });
            const xhr = new XMLHttpRequest();
            xhr.open("POST", URL, true);
            xhr.withCredentials = 'true';
            
            xhr.onreadystatechange = function () {
              if(xhr.readyState === XMLHttpRequest.DONE) {
                const status = xhr.status;
                if (status === 0 || (status >= 200 && status < 400)) {
                  console.log('Visiter IP', JSON.parse(xhr.response));
                } else {
                  console.log('Something went wrong', xhr.response);
                }
              }
            };
            xhr.send(payload);
      `
    return new Response(response, {
      headers: {
        ...corsHeaders,
      },
    })
  }
}
