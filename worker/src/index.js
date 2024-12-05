addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  const ALLOWED_ORIGIN = 'https://shreyas-m-246418.github.io'
  const REDIRECT_URI = 'https://shreyas-m-246418.github.io/spa-gh/#/callback'
  
  async function handleRequest(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }
  
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
  
    if (!code) {
      return new Response(JSON.stringify({ error: 'Missing code parameter' }), { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      })
    }
  
    try {
        console.log('Exchanging code:', code);
        const response = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code: code,
            redirect_uri: 'https://shreyas-m-246418.github.io/spa-gh/#/callback'
          }),
        })
  
      const data = await response.json()
      
      if (data.error) {
        console.error('GitHub OAuth error:', data)
        return new Response(JSON.stringify(data), {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          }
        })
      }
  
      return new Response(JSON.stringify(data), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      })
    } catch (error) {
      console.error('Worker error:', error)
      return new Response(JSON.stringify({ 
        error: 'Failed to exchange code',
        message: error.message 
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      })
    }
  }