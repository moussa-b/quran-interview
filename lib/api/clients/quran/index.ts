/**
 * Quran Foundation API Client
 * 
 * This module provides a typed, authenticated client for the Quran Foundation API.
 * 
 * @example
 * ```typescript
 * import { getChapters, getChapter, getVerse } from '@/lib/api/clients/quran';
 * 
 * const chapters = await getChapters();
 * const chapter = await getChapter(2);
 * const verse = await getVerse(2, 5);
 * ```
 */

// Export main API client functions
export { getChapters, getChapter, getVerse, quranClient } from './client';

// Export auth utilities (mainly for testing/debugging)
export { getAccessToken, clearTokenCache } from './auth';

// Export types for consumers
export type {
  Chapter,
  ChaptersResponse,
  ChapterResponse,
  Verse,
  VerseResponse,
  OAuth2TokenResponse,
  CachedToken,
} from './types';

