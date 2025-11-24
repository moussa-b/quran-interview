/**
 * Quran API Request Utilities
 * 
 * Shared authenticated request handler for all Quran Foundation API calls
 */

import { getAccessToken } from './auth';
import { getClientId, getContentApiBaseUrl } from './config';

/**
 * Make an authenticated request to the Quran API
 * 
 * This function handles:
 * - OAuth2 token retrieval and attachment
 * - Client ID header injection
 * - Language parameter handling
 * - Error handling and logging
 * 
 * @param endpoint - API endpoint path (e.g., '/chapters', '/verses/by_key/2:255')
 * @param language - Optional language code for localized content (e.g., 'en', 'fr', 'ar')
 * @param options - Additional fetch options (headers, method, body, etc.)
 * @returns Promise with the parsed JSON response
 * @throws Error if the request fails or returns non-2xx status
 * 
 * @example
 * ```typescript
 * // Simple GET request
 * const response = await makeAuthenticatedRequest<ChaptersResponse>('/chapters');
 * 
 * // With language parameter
 * const response = await makeAuthenticatedRequest<ChapterResponse>('/chapters/2', 'fr');
 * 
 * // With query parameters in endpoint
 * const response = await makeAuthenticatedRequest<VerseResponse>(
 *   '/verses/by_key/2:255?fields=text_uthmani',
 *   'en'
 * );
 * ```
 */
export async function makeAuthenticatedRequest<T>(
  endpoint: string,
  language?: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Get valid access token
    const accessToken = await getAccessToken();
    const clientId = getClientId();
    const contentApiBaseUrl = getContentApiBaseUrl();

    // Build URL with language query parameter if provided
    let url = `${contentApiBaseUrl}${endpoint}`;
    if (language) {
      const separator = endpoint.includes('?') ? '&' : '?';
      url = `${url}${separator}language=${encodeURIComponent(language)}`;
    }

    // Make the API request with authentication headers
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'x-auth-token': accessToken,
        'x-client-id': clientId,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Error making request to ${endpoint}:`, error);
    throw error;
  }
}

