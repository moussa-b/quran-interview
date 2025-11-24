# Quran Foundation API Client

This directory contains the client implementation for integrating with the Quran Foundation API, including OAuth2 authentication, content fetching, and translation management.

## Overview

The Quran client provides typed, authenticated access to the Quran Foundation API's content endpoints. It handles OAuth2 token management automatically with caching and refresh, and intelligently manages translation resources.

## Architecture

The client is organized into specialized modules for better maintainability:

```
quran/
├── config.ts         → Shared configuration utilities
├── request.ts        → Authenticated request handler
├── auth.ts          → OAuth2 token manager
├── client.ts        → Main API methods (chapters, verses)
├── translations.ts  → Translation resource manager
├── recitations.ts   → Recitation resource manager
├── types.ts         → TypeScript type definitions
└── index.ts         → Public API exports
```

## Files

- **`config.ts`** - Shared configuration utilities (base URL, client ID)
- **`request.ts`** - Centralized authenticated request handler
- **`auth.ts`** - OAuth2 token manager with automatic caching and refresh
- **`client.ts`** - Main API client with methods for fetching chapters and verses
- **`translations.ts`** - Translation resource manager with caching
- **`recitations.ts`** - Recitation resource manager for listing available reciters
- **`types.ts`** - TypeScript type definitions for API requests and responses
- **`index.ts`** - Barrel exports for convenient imports

## Usage

### Basic Examples

```typescript
import { getChapters, getChapter, getVerse, getVersesByRange } from '@/lib/api/clients/quran';

// Fetch all chapters
const { chapters } = await getChapters('en');

// Fetch a specific chapter
const { chapter } = await getChapter(2, 'fr');

// Fetch a single verse
const { verse } = await getVerse(2, 255);

// Fetch a single verse with translations
const { verse } = await getVerse(2, 255, 'en', true);

// Fetch a range of verses with translations
const { verses } = await getVersesByRange(2, 1, 5, 'en', true);
```

### Translation Management

```typescript
import { getTranslationId } from '@/lib/api/clients/quran';

// Get translation ID for a language (with caching)
const translationId = await getTranslationId('en');
// Returns: 131 (Dr. Mustafa Khattab, the Clear Quran)

const frenchId = await getTranslationId('fr');
// Returns: 136 (French translation)
```

## Environment Variables

Required environment variables (set in `.env.local`):

```bash
QURAN_AUTH_API_BASE_URL=https://prelive-oauth2.quran.foundation
QURAN_CONTENT_API_BASE_URL=https://apis-prelive.quran.foundation/content/api/v4
QURAN_CLIENT_ID=your_client_id_here
QURAN_CLIENT_SECRET=your_client_secret_here
```

## Features

### OAuth2 Token Management (`auth.ts`)
- Automatically fetches access tokens using client credentials
- Caches tokens in memory
- Auto-refreshes tokens before expiration (60s buffer)
- Uses Basic Authentication (client_id:client_secret)

### Translation Management (`translations.ts`)
- Fetches available translations from `/resources/translations` endpoint
- Caches translation IDs by language to minimize API calls
- Provides fallback translation IDs for common languages
- Automatically selects appropriate translation for each language

## API Flow

### Standard Request Flow
```
1. Application calls getChapters() or other method
2. client.ts calls makeAuthenticatedRequest() from request.ts
3. request.ts gets configuration from config.ts
4. request.ts calls getAccessToken() from auth.ts
5. auth.ts checks if cached token is valid
6. If invalid/expired, fetch new token from OAuth2 endpoint
7. request.ts makes authenticated request to content API with token
8. Return typed response
```

### Verse with Translation Flow
```
1. Application calls getVerse(2, 255, 'en', true)
2. client.ts calls getTranslationId('en') from translations.ts
3. translations.ts checks cache for translation ID
4. If not cached, fetch from /resources/translations endpoint
5. Cache and return translation ID (e.g., 131)
6. client.ts builds endpoint: /verses/by_key/2:255?fields=text_uthmani&translations=131
7. Make authenticated request via request.ts
8. Return verse with Arabic text and translation
```

## Available Methods

### Chapters

#### `getChapters(language?: string): Promise<ChaptersResponse>`
Fetches all 114 chapters of the Quran.

**Parameters:**
- `language` (optional) - Language code for localized chapter names (e.g., 'en', 'fr')

**Example:**
```typescript
const { chapters } = await getChapters('en');
```

#### `getChapter(id: number, language?: string): Promise<ChapterResponse>`
Fetches a single chapter by ID (1-114).

**Parameters:**
- `id` - Chapter number (1-114)
- `language` (optional) - Language code for localized content

**Example:**
```typescript
const { chapter } = await getChapter(2, 'fr');
```

### Verses

#### `getVerse(chapterId: number, verseNumber: number, language?: string, includeTranslations?: boolean): Promise<VerseResponse>`
Fetches a single verse by chapter ID and verse number.

**Parameters:**
- `chapterId` - Chapter number (1-114)
- `verseNumber` - Verse number within the chapter
- `language` (optional) - Language code
- `includeTranslations` (optional) - Whether to include translations (default: false)

**Example:**
```typescript
// Without translation
const { verse } = await getVerse(2, 255);

// With translation
const { verse } = await getVerse(2, 255, 'en', true);
console.log(verse.text_uthmani); // Arabic text
console.log(verse.translations); // Translation array
```

#### `getVersesByRange(chapterId: number, startVerse: number, endVerse: number | null, language?: string, includeTranslations?: boolean): Promise<VersesResponse>`
Fetches multiple verses in a range.

**Parameters:**
- `chapterId` - Chapter number (1-114)
- `startVerse` - Starting verse number
- `endVerse` - Ending verse number (null for single verse)
- `language` (optional) - Language code
- `includeTranslations` (optional) - Whether to include translations

**Example:**
```typescript
// Fetch verses 1-5 of chapter 2 with translations
const { verses } = await getVersesByRange(2, 1, 5, 'en', true);
```

### Translations

#### `getTranslationId(language: string): Promise<number>`
Gets the translation ID for a specific language. Results are cached to minimize API calls.

**Parameters:**
- `language` - Language code (e.g., 'en', 'fr')

**Returns:**
- Translation resource ID

**Example:**
```typescript
const translationId = await getTranslationId('en');
// Returns: 131 (Dr. Mustafa Khattab, the Clear Quran)
```

## Extending

To add more endpoints:

1. Add response types to `types.ts`
2. Add the method to `client.ts` using `makeAuthenticatedRequest()`
3. Export the method from `index.ts`
4. Update this README with documentation

**Example:**
```typescript
// In types.ts
export interface JuzResponse {
  juz: Juz;
}

// In client.ts
export async function getJuz(id: number, language?: string): Promise<JuzResponse> {
  if (id < 1 || id > 30) {
    throw new Error('Invalid juz ID. Must be between 1 and 30.');
  }
  return makeAuthenticatedRequest<JuzResponse>(`/juzs/${id}`, language);
}

// In index.ts
export { getJuz } from './client';
```

## Caching

The client implements two levels of caching:

### Token Cache (`auth.ts`)
- OAuth2 access tokens are cached in memory
- Automatic refresh before expiration (60s buffer)
- Cache is cleared on token refresh

### Translation Cache (`translations.ts`)
- Translation IDs are cached by language code
- Cache persists for the lifetime of the server process
- Use `clearTranslationCache()` to manually clear (useful for testing)

### Recitation Cache (`recitations.ts`)
- Recitation lists are cached by language to avoid duplicate network calls
- Cache persists for the lifetime of the server process
- Use `clearRecitationCache()` to manually clear (useful for testing)

## Security

- All API calls are server-side only
- Tokens are never exposed to the client
- Environment variables are only accessible server-side
- Never commit `.env.local` to version control
- All requests use OAuth2 authentication
- Client credentials flow (no user context needed)

## Testing

```typescript
import {
  clearTokenCache,
  clearTranslationCache,
  clearRecitationCache,
} from '@/lib/api/clients/quran';

// Clear caches between tests
beforeEach(() => {
  clearTokenCache();
  clearTranslationCache();
  clearRecitationCache();
});
```

## Reference

- [Quran Foundation API Documentation](https://api-docs.quran.foundation/)
- [Content APIs](https://api-docs.quran.foundation/docs/content_apis_versioned/)
- [Translation Resources](https://api-docs.quran.foundation/docs/content_apis_versioned/translations/)
- [Recitation Resources](https://api-docs.quran.foundation/docs/content_apis_versioned/recitations/)

