/**
 * Types for Quran Foundation API
 */

/**
 * OAuth2 Token Response from Quran Foundation API
 */
export interface OAuth2TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

/**
 * Cached token with expiration tracking
 */
export interface CachedToken {
  token: string;
  expiresAt: number;
}

/**
 * Chapter data from Quran API
 */
export interface Chapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: number[];
  translated_name: {
    language_name: string;
    name: string;
  };
}

/**
 * Chapters API Response (GET /chapters)
 */
export interface ChaptersResponse {
  chapters: Chapter[];
}

/**
 * Single Chapter API Response (GET /chapters/:id)
 */
export interface ChapterResponse {
  chapter: Chapter;
}

/**
 * Translation data for a verse
 */
export interface Translation {
  id: number;
  resource_id: number;
  text: string;
  resource_name?: string;
  language_name?: string;
}

/**
 * Verse data from Quran API
 */
export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  page_number: number;
  juz_number: number;
  text_uthmani?: string;
  translations?: Translation[];
}

/**
 * Single Verse API Response (GET /verses/by_key/:verse_key)
 */
export interface VerseResponse {
  verse: Verse;
}

/**
 * Multiple Verses API Response
 */
export interface VersesResponse {
  verses: Verse[];
}

/**
 * Audio file entry for verse recitations
 */
export interface VerseAudioFile {
  verse_key: string;
  url: string;
}

/**
 * Pagination metadata returned by Quran API
 */
export interface PaginationMeta {
  per_page: number;
  current_page: number;
  next_page: number | null;
  total_pages: number;
  total_records: number;
}

/**
 * Chapter audio API response
 */
export interface ChapterAudioResponse {
  audio_files: VerseAudioFile[];
  pagination: PaginationMeta;
}

