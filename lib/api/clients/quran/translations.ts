import { makeAuthenticatedRequest } from './request';

/**
 * Translation resource from Quran API
 */
export interface TranslationResource {
  id: number;
  name: string;
  author_name: string;
  slug: string;
  language_name: string;
  translated_name: {
    name: string;
    language_name: string;
  };
}

/**
 * Translations API Response
 */
interface TranslationsResponse {
  translations: TranslationResource[];
}

/**
 * Cache for translation IDs by language
 */
const translationCache: Map<string, number> = new Map();

/**
 * Default translation IDs for common languages
 * These are fallbacks if the API call fails
 */
const DEFAULT_TRANSLATION_IDS: Record<string, number> = {
  en: 131, // Dr. Mustafa Khattab, the Clear Quran
  fr: 136, // French translation (Hamidullah)
  ar: 20,  // Arabic (if needed)
};

/**
 * Get translation ID for a specific language
 * Uses cache to avoid repeated API calls
 * 
 * @param language - Language code (e.g., 'en', 'fr')
 * @returns Translation ID
 */
export async function getTranslationId(language: string): Promise<number> {
  // Check cache first
  if (translationCache.has(language)) {
    return translationCache.get(language)!;
  }

  try {
    // Fetch translations from API using shared request handler
    const response = await makeAuthenticatedRequest<TranslationsResponse>(
      '/resources/translations',
      language
    );
    
    // Find a translation for this language
    // Prefer "Clear Quran" for English or the first available translation
    const translation = response.translations.find(
      (t) => t.language_name.toLowerCase() === language.toLowerCase()
    ) || response.translations.find(
      (t) => t.language_name.toLowerCase().startsWith(language.toLowerCase())
    );

    if (translation) {
      console.log(`Found translation for ${language}:`, translation.id, translation.name);
      translationCache.set(language, translation.id);
      return translation.id;
    }

    // Fallback to default if available
    if (DEFAULT_TRANSLATION_IDS[language]) {
      console.log(`Using default translation ID for ${language}:`, DEFAULT_TRANSLATION_IDS[language]);
      translationCache.set(language, DEFAULT_TRANSLATION_IDS[language]);
      return DEFAULT_TRANSLATION_IDS[language];
    }

    throw new Error(`No translation found for language: ${language}`);
  } catch (error) {
    console.error('Error fetching translation ID:', error);
    
    // Fallback to default if available
    if (DEFAULT_TRANSLATION_IDS[language]) {
      console.log(`Falling back to default translation ID for ${language}:`, DEFAULT_TRANSLATION_IDS[language]);
      translationCache.set(language, DEFAULT_TRANSLATION_IDS[language]);
      return DEFAULT_TRANSLATION_IDS[language];
    }

    // Last resort: use English translation
    return DEFAULT_TRANSLATION_IDS.en;
  }
}

/**
 * Clear translation cache (useful for testing)
 */
export function clearTranslationCache(): void {
  translationCache.clear();
}

