addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  const ALLOWED_ORIGIN = 'https://shreyas-m-246418.github.io'
  
  async function handleRequest(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      })
    }
  
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
  
    if (!code) {
      return new Response('Missing code parameter', { status: 400 })
    }
  
    try {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code: code,
        }),
      })
  
      const data = await tokenResponse.json()
      
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to exchange code' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        },
      })
    }
  }