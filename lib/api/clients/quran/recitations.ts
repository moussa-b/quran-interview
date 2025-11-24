import { makeAuthenticatedRequest } from './request';

/**
 * Recitation resource from Quran API
 */
export interface RecitationResource {
  id: number;
  reciter_name: string;
  style: string;
  translated_name: {
    name: string;
    language_name: string;
  };
}

/**
 * Recitations API response shape
 * The API sometimes returns a root object with a recitations array,
 * and sometimes returns the array directly (per documentation examples).
 */
type RecitationsResponse = RecitationResource[] | { recitations: RecitationResource[] };

/**
 * Cache for recitations by language
 */
const recitationCache: Map<string, RecitationResource[]> = new Map();

/**
 * Normalize the various possible response shapes into a recitations array.
 */
function extractRecitations(response: RecitationsResponse): RecitationResource[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (response && Array.isArray(response.recitations)) {
    return response.recitations;
  }

  return [];
}

/**
 * Fetch recitations for a given language, using cache when possible.
 *
 * @param language - Language code for reciter naming (defaults to 'en')
 * @returns List of recitation metadata
 */
export async function getRecitations(language: string = 'en'): Promise<RecitationResource[]> {
  if (recitationCache.has(language)) {
    return recitationCache.get(language)!;
  }

  const response = await makeAuthenticatedRequest<RecitationsResponse>(
    '/resources/recitations',
    language
  );

  const recitations = extractRecitations(response);

  if (!recitations.length) {
    throw new Error(`No recitations returned for language: ${language}`);
  }

  recitationCache.set(language, recitations);
  return recitations;
}

/**
 * Return the first recitation id for a given language. Uses cache when available.
 *
 * @param language - Language code for reciter naming (defaults to 'en')
 * @returns First recitation id available for the language
 */
export async function getDefaultRecitationId(language: string = 'en'): Promise<number> {
  const cachedRecitations = recitationCache.get(language);
  if (cachedRecitations && cachedRecitations.length) {
    return cachedRecitations[0].id;
  }

  const recitations = await getRecitations(language);
  if (!recitations.length) {
    throw new Error(`No recitations returned for language: ${language}`);
  }

  return recitations[0].id;
}

/**
 * Clear recitation cache (useful for testing)
 */
export function clearRecitationCache(): void {
  recitationCache.clear();
}


