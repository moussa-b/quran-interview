import { getTranslationId } from './translations';
import { makeAuthenticatedRequest } from './request';
import { getDefaultRecitationId } from './recitations';
import {
  ChapterAudioResponse,
  ChapterResponse,
  ChaptersResponse,
  VerseAudioFile,
  VerseResponse,
  VersesResponse,
} from './types';

const AUDIO_PAGE_SIZE = 50;

/**
 * Fetch all chapters from the Quran API
 *
 * @param language - Optional language code for localized content (e.g., 'en', 'fr', 'ar')
 * @returns Promise with chapters data
 * @throws Error if the request fails
 * 
 * @example
 * ```typescript
 * const chapters = await getChapters();
 * console.log(chapters.chapters.length); // 114
 *
 * // With French translations
 * const chaptersFr = await getChapters('fr');
 * ```
 */
export async function getChapters(language?: string): Promise<ChaptersResponse> {
  return makeAuthenticatedRequest<ChaptersResponse>('/chapters', language);
}

/**
 * Fetch a single chapter by ID from the Quran API
 * 
 * @param id - Chapter ID (1-114)
 * @param language - Optional language code for localized content (e.g., 'en', 'fr', 'ar')
 * @returns Promise with chapter data
 * @throws Error if the request fails or chapter ID is invalid
 * 
 * @example
 * ```typescript
 * const response = await getChapter(2);
 * console.log(response.chapter.name_simple); // "Al-Baqarah"
 *
 * // With French translations
 * const responseFr = await getChapter(2, 'fr');
 * ```
 */
export async function getChapter(id: number, language?: string): Promise<ChapterResponse> {
  if (id < 1 || id > 114) {
    throw new Error(`Invalid chapter ID: ${id}. Must be between 1 and 114.`);
  }
  return makeAuthenticatedRequest<ChapterResponse>(`/chapters/${id}`, language);
}

/**
 * Fetch a single verse by chapter and verse number from the Quran API
 * 
 * @param chapterId - Chapter ID (1-114)
 * @param verseNumber - Verse number within the chapter
 * @param language - Optional language code for localized content (e.g., 'en', 'fr', 'ar')
 * @param includeTranslations - Whether to include translations (default: false)
 * @returns Promise with verse data
 * @throws Error if the request fails or parameters are invalid
 * 
 * @example
 * ```typescript
 * const response = await getVerse(2, 5);
 * console.log(response.verse.verse_key); // "2:5"
 *
 * // With language and translations
 * const responseFr = await getVerse(2, 5, 'fr', true);
 * ```
 */
export async function getVerse(
  chapterId: number, 
  verseNumber: number, 
  language?: string,
  includeTranslations: boolean = false
): Promise<VerseResponse> {
  if (chapterId < 1 || chapterId > 114) {
    throw new Error(`Invalid chapter ID: ${chapterId}. Must be between 1 and 114.`);
  }
  if (verseNumber < 1) {
    throw new Error(`Invalid verse number: ${verseNumber}. Must be greater than 0.`);
  }
  
  const verseKey = `${chapterId}:${verseNumber}`;
  let endpoint = `/verses/by_key/${verseKey}`;
  
  // Add text_uthmani and translations if requested
  if (includeTranslations && language) {
    // Get the appropriate translation ID for the language
    const translationId = await getTranslationId(language);
    endpoint += `?fields=text_uthmani&translations=${translationId}`;
  } else if (includeTranslations) {
    // Default to English if no language specified
    endpoint += `?fields=text_uthmani&translations=131`;
  }
  
  return makeAuthenticatedRequest<VerseResponse>(endpoint, language);
}

/**
 * Fetch multiple verses by range (e.g., 2:5-10)
 * 
 * @param chapterId - Chapter ID (1-114)
 * @param startVerse - Starting verse number
 * @param endVerse - Ending verse number (null for single verse)
 * @param language - Optional language code for localized content
 * @param includeTranslations - Whether to include translations (default: false)
 * @returns Promise with verses data
 * @throws Error if the request fails or parameters are invalid
 * 
 * @example
 * ```typescript
 * const response = await getVersesByRange(2, 5, 10, 'en', true);
 * console.log(response.verses.length); // 6 (verses 5-10 inclusive)
 * ```
 */
export async function getVersesByRange(
  chapterId: number,
  startVerse: number,
  endVerse: number | null,
  language?: string,
  includeTranslations: boolean = false
): Promise<VersesResponse> {
  if (chapterId < 1 || chapterId > 114) {
    throw new Error(`Invalid chapter ID: ${chapterId}. Must be between 1 and 114.`);
  }
  if (startVerse < 1) {
    throw new Error(`Invalid start verse: ${startVerse}. Must be greater than 0.`);
  }
  
  // If no end verse or same as start, fetch single verse
  if (endVerse === null || endVerse === startVerse) {
    const response = await getVerse(chapterId, startVerse, language, includeTranslations);
    return { verses: [response.verse] };
  }
  
  if (endVerse < startVerse) {
    throw new Error(`End verse (${endVerse}) must be greater than or equal to start verse (${startVerse}).`);
  }
  
  // Fetch all verses in the range
  const versePromises: Promise<VerseResponse>[] = [];
  for (let i = startVerse; i <= endVerse; i++) {
    versePromises.push(getVerse(chapterId, i, language, includeTranslations));
  }
  
  const responses = await Promise.all(versePromises);
  return {
    verses: responses.map(r => r.verse)
  };
}

/**
 * Fetch audio metadata for a specific verse using recitation endpoint
 *
 * @param chapterId - Chapter ID (1-114)
 * @param verseNumber - Verse number within the chapter
 * @param recitationId - Optional recitation resource id (defaults to first available)
 * @returns Verse audio file metadata
 */
export async function getVerseAudio(
  chapterId: number,
  verseNumber: number,
  recitationId?: number
): Promise<VerseAudioFile> {
  if (chapterId < 1 || chapterId > 114) {
    throw new Error(`Invalid chapter ID: ${chapterId}. Must be between 1 and 114.`);
  }
  if (verseNumber < 1) {
    throw new Error(`Invalid verse number: ${verseNumber}. Must be greater than 0.`);
  }

  const resolvedRecitationId = recitationId ?? await getDefaultRecitationId();
  const page = Math.ceil(verseNumber / AUDIO_PAGE_SIZE);

  const response = await makeAuthenticatedRequest<ChapterAudioResponse>(
    `/recitations/${resolvedRecitationId}/by_chapter/${chapterId}?page=${page}&per_page=${AUDIO_PAGE_SIZE}`
  );

  const verseKey = `${chapterId}:${verseNumber}`;
  const audioEntry = response.audio_files.find(file => file.verse_key === verseKey);

  if (!audioEntry) {
    throw new Error(`Audio for verse ${verseKey} not found in recitation ${resolvedRecitationId}.`);
  }

  return audioEntry;
}

/**
 * Export the base client for extending with more endpoints
 */
export const quranClient = {
  getChapters,
  getChapter,
  getVerse,
  getVersesByRange,
  getVerseAudio,
};

