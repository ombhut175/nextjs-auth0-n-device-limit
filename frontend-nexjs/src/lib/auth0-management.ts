let cache: { token: string; exp: number } | null = null;

export async function getMgmtToken(): Promise<string> {
  // Validate required environment variables
  if (!process.env.AUTH0_DOMAIN) {
    throw new Error('AUTH0_DOMAIN environment variable is not set');
  }
  if (!process.env.MGMT_CLIENT_ID) {
    throw new Error('MGMT_CLIENT_ID environment variable is not set');
  }
  if (!process.env.MGMT_CLIENT_SECRET) {
    throw new Error('MGMT_CLIENT_SECRET environment variable is not set');
  }

  const now = Date.now();
  
  // Return cached token if still valid (with 1-minute buffer)
  if (cache && now < cache.exp - 60_000) {
    return cache.token;
  }

  const res = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.MGMT_CLIENT_ID,
      client_secret: process.env.MGMT_CLIENT_SECRET,
      audience: process.env.MGMT_AUDIENCE || `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get management token: ${res.status} ${error}`);
  }

  const json = await res.json() as { access_token: string; expires_in: number };
  
  cache = {
    token: json.access_token,
    exp: Date.now() + json.expires_in * 1000,
  };

  return cache.token;
}
