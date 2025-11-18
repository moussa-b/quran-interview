import { getAccessToken } from './auth';
import { ChaptersResponse, ChapterResponse, VerseResponse } from './types';

/**
 * Get the content API base URL from environment variables
 */
function getContentApiBaseUrl(): string {
  const baseUrl = process.env.QURAN_CONTENT_API_BASE_URL;
  if (!baseUrl) {
    throw new Error('QURAN_CONTENT_API_BASE_URL environment variable is not set');
  }
  return baseUrl;
}

/**
 * Get the client ID from environment variables
 */
function getClientId(): string {
  const clientId = process.env.QURAN_CLIENT_ID;
  if (!clientId) {
    throw new Error('QURAN_CLIENT_ID environment variable is not set');
  }
  return clientId;
}

/**
 * Make an authenticated request to the Quran API
 */
async function makeAuthenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Get valid access token
    const accessToken = await getAccessToken();
    const clientId = getClientId();
    const contentApiBaseUrl = getContentApiBaseUrl();

    // Make the API request with authentication headers
    const response = await fetch(`${contentApiBaseUrl}${endpoint}`, {
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

/**
 * Fetch all chapters from the Quran API
 * 
 * @returns Promise with chapters data
 * @throws Error if the request fails
 * 
 * @example
 * ```typescript
 * const chapters = await getChapters();
 * console.log(chapters.chapters.length); // 114
 * ```
 */
export async function getChapters(): Promise<ChaptersResponse> {
  return makeAuthenticatedRequest<ChaptersResponse>('/chapters');
}

/**
 * Fetch a single chapter by ID from the Quran API
 * 
 * @param id - Chapter ID (1-114)
 * @returns Promise with chapter data
 * @throws Error if the request fails or chapter ID is invalid
 * 
 * @example
 * ```typescript
 * const response = await getChapter(2);
 * console.log(response.chapter.name_simple); // "Al-Baqarah"
 * ```
 */
export async function getChapter(id: number): Promise<ChapterResponse> {
  if (id < 1 || id > 114) {
    throw new Error(`Invalid chapter ID: ${id}. Must be between 1 and 114.`);
  }
  return makeAuthenticatedRequest<ChapterResponse>(`/chapters/${id}`);
}

/**
 * Fetch a single verse by chapter and verse number from the Quran API
 * 
 * @param chapterId - Chapter ID (1-114)
 * @param verseNumber - Verse number within the chapter
 * @returns Promise with verse data
 * @throws Error if the request fails or parameters are invalid
 * 
 * @example
 * ```typescript
 * const response = await getVerse(2, 5);
 * console.log(response.verse.verse_key); // "2:5"
 * ```
 */
export async function getVerse(chapterId: number, verseNumber: number): Promise<VerseResponse> {
  if (chapterId < 1 || chapterId > 114) {
    throw new Error(`Invalid chapter ID: ${chapterId}. Must be between 1 and 114.`);
  }
  if (verseNumber < 1) {
    throw new Error(`Invalid verse number: ${verseNumber}. Must be greater than 0.`);
  }
  
  const verseKey = `${chapterId}:${verseNumber}`;
  return makeAuthenticatedRequest<VerseResponse>(`/verses/by_key/${verseKey}`);
}

/**
 * Export the base client for extending with more endpoints
 */
export const quranClient = {
  getChapters,
  getChapter,
  getVerse,
};

