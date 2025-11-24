import { CachedToken, OAuth2TokenResponse } from './types';

/**
 * In-memory token cache
 */
let tokenCache: CachedToken | null = null;

/**
 * Get environment variables with validation
 */
function getEnvVars() {
  const baseUrl = process.env.QURAN_AUTH_API_BASE_URL;
  const clientId = process.env.QURAN_CLIENT_ID;
  const clientSecret = process.env.QURAN_CLIENT_SECRET;

  if (!baseUrl) {
    throw new Error('QURAN_AUTH_API_BASE_URL environment variable is not set');
  }
  if (!clientId) {
    throw new Error('QURAN_CLIENT_ID environment variable is not set');
  }
  if (!clientSecret) {
    throw new Error('QURAN_CLIENT_SECRET environment variable is not set');
  }

  return { baseUrl, clientId, clientSecret };
}

/**
 * Check if the cached token is still valid
 */
function isTokenValid(cachedToken: CachedToken | null): boolean {
  if (!cachedToken) {
    return false;
  }
  // Add 60 second buffer to refresh before actual expiration
  const now = Date.now();
  return cachedToken.expiresAt > now + 60000;
}

/**
 * Fetch a new access token from the OAuth2 endpoint
 */
async function fetchNewToken(): Promise<CachedToken> {
  const { baseUrl, clientId, clientSecret } = getEnvVars();
  
  // Create Basic Auth header (base64 of clientId:clientSecret)
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  const tokenUrl = `${baseUrl}/oauth2/token`;
  
  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'content',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OAuth2 token request failed: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const data: OAuth2TokenResponse = await response.json();
    
    // Cache the token with expiration time
    const expiresAt = Date.now() + (data.expires_in * 1000);
    const cachedToken: CachedToken = {
      token: data.access_token,
      expiresAt,
    };
    
    tokenCache = cachedToken;
    
    return cachedToken;
  } catch (error) {
    console.error('Error fetching OAuth2 token:', error);
    throw error;
  }
}

/**
 * Get a valid access token (from cache or fetch new)
 */
export async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (isTokenValid(tokenCache)) {
    return tokenCache!.token;
  }
  
  // Fetch new token if cache is invalid or expired
  const newToken = await fetchNewToken();
  return newToken.token;
}

/**
 * Clear the token cache (useful for testing or forced refresh)
 */
export function clearTokenCache(): void {
  tokenCache = null;
}

