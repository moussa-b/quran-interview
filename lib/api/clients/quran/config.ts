/**
 * Quran API Configuration
 * 
 * Shared configuration utilities for accessing Quran Foundation API
 */

/**
 * Get the content API base URL from environment variables
 * 
 * @returns The base URL for Quran Foundation Content API
 * @throws Error if QURAN_CONTENT_API_BASE_URL is not set
 * 
 * @example
 * ```typescript
 * const baseUrl = getContentApiBaseUrl();
 * // Returns: "https://apis-prelive.quran.foundation/content/api/v4"
 * ```
 */
export function getContentApiBaseUrl(): string {
  const baseUrl = process.env.QURAN_CONTENT_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('QURAN_CONTENT_API_BASE_URL environment variable is not set');
  }
  return baseUrl;
}

/**
 * Get the client ID from environment variables
 * 
 * @returns The client ID for API authentication
 * @throws Error if QURAN_CLIENT_ID is not set
 * 
 * @example
 * ```typescript
 * const clientId = getClientId();
 * ```
 */
export function getClientId(): string {
  const clientId = process.env.QURAN_CLIENT_ID;
  if (!clientId) {
    throw new Error('QURAN_CLIENT_ID environment variable is not set');
  }
  return clientId;
}

