# API Module

This module provides the application's data layer with clear separation between external integrations and internal services:

- **External API Clients** (`lib/api/clients/`) - Third-party API integrations
  - `quran/` - Quran Foundation API client (OAuth2 authenticated)
- **Internal Services** (`lib/api/services/`) - Database operations
  - `topics/` - Topics service
  - `categories/` - Categories service
  - `subcategories/` - Subcategories service
  - `items/` - Items service
  - `types.ts` - Centralized type definitions
- **`types.ts`** - Generic API types

## Architecture Overview

The codebase follows Next.js best practices with clear separation of concerns:

```
lib/api/
├── clients/              # External API integrations
│   └── quran/           # Quran Foundation API client
│       ├── config.ts    # Shared configuration utilities
│       ├── request.ts   # Authenticated request handler
│       ├── auth.ts      # OAuth2 token management
│       ├── client.ts    # Main API methods
│       ├── translations.ts  # Translation resource manager
│       ├── types.ts     # TypeScript type definitions
│       ├── index.ts     # Public exports
│       └── README.md    # Detailed documentation
├── services/            # Internal business logic & database operations
│   ├── types.ts         # Centralized type definitions
│   ├── topics/          # Topics service
│   │   ├── service.ts
│   │   └── index.ts
│   ├── categories/      # Categories service
│   │   ├── service.ts
│   │   └── index.ts
│   ├── subcategories/   # Subcategories service
│   │   ├── service.ts
│   │   └── index.ts
│   └── items/           # Items service
│       ├── service.ts
│       └── index.ts
├── index.ts             # Convenience re-exports
├── types.ts             # Generic API types
└── README.md            # This file
```

## Quran Foundation API Integration

The Quran client (`lib/api/clients/quran/`) provides integration with the Quran Foundation API, including:
- ✅ OAuth2 authentication with automatic token refresh
- ✅ Chapter and verse fetching with translation support
- ✅ Translation resource management with caching
- ✅ Verse range queries for batch fetching
- ✅ Full TypeScript support with comprehensive types

See [`lib/api/clients/quran/README.md`](./clients/quran/README.md) for detailed documentation.

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```bash
# Quran Foundation API Configuration
QURAN_AUTH_API_BASE_URL=https://prelive-oauth2.quran.foundation
QURAN_CONTENT_API_BASE_URL=https://apis-prelive.quran.foundation/content/api/v4
QURAN_CLIENT_ID=559a9010-b310-4fef-a3eb-12195031ee85
QURAN_CLIENT_SECRET=your_client_secret_here
```

**Important:** Replace `your_client_secret_here` with your actual client secret from Quran Foundation.

### 2. Environment Variables Reference

You can also create a `.env.example` file for team reference:

```bash
# Quran Foundation API Configuration
QURAN_AUTH_API_BASE_URL=https://prelive-oauth2.quran.foundation
QURAN_CONTENT_API_BASE_URL=https://apis-prelive.quran.foundation/content/api/v4
QURAN_CLIENT_ID=your_client_id_here
QURAN_CLIENT_SECRET=your_client_secret_here
```

## Usage

### Basic Examples

#### Fetching All Chapters

```typescript
import { getChapters } from '@/lib/api/clients/quran';

export default async function ChaptersPage({ locale }: { locale: string }) {
  try {
    // Pass locale for language-specific translations
    const data = await getChapters(locale);
    
    return (
      <div>
        <h1>Quran Chapters</h1>
        <ul>
          {data.chapters.map((chapter) => (
            <li key={chapter.id}>
              {chapter.id}. {chapter.name_simple} ({chapter.name_arabic})
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return <div>Error loading chapters</div>;
  }
}
```

#### Fetching a Single Chapter

```typescript
import { getChapter } from '@/lib/api/clients/quran';

export default async function ChapterPage({ 
  params 
}: { 
  params: { id: string; locale: string } 
}) {
  try {
    // Pass locale for language-specific translations
    const { chapter } = await getChapter(parseInt(params.id), params.locale);
    
    return (
      <div>
        <h1>{chapter.name_simple}</h1>
        <p className="arabic">{chapter.name_arabic}</p>
        <p>{chapter.translated_name.name}</p>
        <p>Verses: {chapter.verses_count}</p>
        <p>Revelation: {chapter.revelation_place}</p>
      </div>
    );
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return <div>Error loading chapter</div>;
  }
}
```

#### Fetching a Single Verse

```typescript
import { getVerse } from '@/lib/api/clients/quran';

export default async function VersePage({ 
  params 
}: { 
  params: { chapterId: string; verseNumber: string; locale: string } 
}) {
  try {
    // Fetch verse with translations
    const { verse } = await getVerse(
      parseInt(params.chapterId),
      parseInt(params.verseNumber),
      params.locale,
      true  // Include translations
    );
    
    return (
      <div>
        <h1>Verse {verse.verse_key}</h1>
        {/* Arabic text */}
        {verse.text_uthmani && (
          <p className="arabic text-2xl" dir="rtl">{verse.text_uthmani}</p>
        )}
        {/* Translation */}
        {verse.translations && verse.translations.length > 0 && (
          <p className="translation">{verse.translations[0].text}</p>
        )}
        <p>Page: {verse.page_number} | Juz: {verse.juz_number}</p>
      </div>
    );
  } catch (error) {
    console.error('Error fetching verse:', error);
    return <div>Error loading verse</div>;
  }
}
```

#### Fetching a Range of Verses

```typescript
import { getVersesByRange } from '@/lib/api/clients/quran';

export default async function VersesRangePage({ 
  params 
}: { 
  params: { chapterId: string; startVerse: string; endVerse: string; locale: string } 
}) {
  try {
    const { verses } = await getVersesByRange(
      parseInt(params.chapterId),
      parseInt(params.startVerse),
      parseInt(params.endVerse),
      params.locale,
      true  // Include translations
    );
    
    return (
      <div>
        <h1>Verses {verses[0].verse_key} - {verses[verses.length - 1].verse_key}</h1>
        {verses.map((verse) => (
          <div key={verse.id} className="verse-item">
            <h3>Verse {verse.verse_number}</h3>
            {verse.text_uthmani && (
              <p className="arabic" dir="rtl">{verse.text_uthmani}</p>
            )}
            {verse.translations && verse.translations[0] && (
              <p>{verse.translations[0].text}</p>
            )}
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error('Error fetching verses:', error);
    return <div>Error loading verses</div>;
  }
}
```

### Error Handling

The API client throws errors if:
- Environment variables are missing
- OAuth2 authentication fails
- API requests fail

Always wrap API calls in try-catch blocks.

## Architecture

### Directory Structure

```
lib/api/
├── clients/            # External API integrations
│   └── quran/         # Quran Foundation API client
│       ├── types.ts   # Type definitions for API responses
│       ├── auth.ts    # OAuth2 token manager with caching and refresh
│       ├── client.ts  # Main API client methods
│       ├── index.ts   # Barrel exports
│       └── README.md  # Documentation
├── services/          # Internal business logic & database operations
│   └── topics/        # Topics Taxonomy database service
│       ├── types.ts   # Database table type definitions
│       ├── service.ts # Database query functions
│       ├── index.ts   # Barrel exports
│       └── README.md  # Documentation
├── index.ts           # Convenience re-exports
├── types.ts           # Generic API types
└── README.md          # This file
```

### Files in `clients/quran/`

- **`config.ts`**: Shared configuration utilities (base URL, client ID)
- **`request.ts`**: Centralized authenticated request handler
- **`auth.ts`**: OAuth2 token manager with automatic caching and refresh
- **`client.ts`**: Main API client with methods for fetching chapters and verses
- **`translations.ts`**: Translation resource manager with caching
- **`types.ts`**: TypeScript type definitions for API responses
- **`index.ts`**: Public API exports

### Features

#### Token Management
- Automatically fetches access tokens using client credentials
- Caches tokens in memory
- Auto-refreshes tokens before expiration (60s buffer)
- Uses Basic Authentication (client_id:client_secret)

#### Translation Management
- Fetches available translations from `/resources/translations` endpoint
- Caches translation IDs by language to minimize API calls
- Provides fallback translation IDs for common languages (en: 131, fr: 136)
- Automatically selects appropriate translation for each language

### API Flow

**Standard Request:**
```
1. Call getChapters() or other method
2. client.ts calls makeAuthenticatedRequest() from request.ts
3. request.ts gets config from config.ts
4. request.ts calls getAccessToken() from auth.ts
5. auth.ts checks if cached token is valid
6. If invalid/expired, fetch new token from OAuth2 endpoint
7. Make authenticated request to content API
8. Return typed response
```

**Verse with Translation:**
```
1. Call getVerse(2, 255, 'en', true)
2. client.ts calls getTranslationId('en') from translations.ts
3. Check cache for translation ID; if not cached, fetch from API
4. Build endpoint: /verses/by_key/2:255?fields=text_uthmani&translations=131
5. Make authenticated request via request.ts
6. Return verse with Arabic text and translation
```

## API Reference

### `getChapters(language?: string)`

Fetches all chapters (Surahs) from the Quran.

**Parameters:**
- `language` (string, optional): Language code for localized content (e.g., 'en', 'fr', 'ar')

**Returns:** `Promise<ChaptersResponse>`

**Example:**
```typescript
const { chapters } = await getChapters();
console.log(chapters.length); // 114

// With language
const { chapters: chaptersFr } = await getChapters('fr');
```

### `getChapter(id: number, language?: string)`

Fetches a single chapter by ID (1-114).

**Parameters:**
- `id` (number): Chapter ID, must be between 1 and 114
- `language` (string, optional): Language code for localized content (e.g., 'en', 'fr', 'ar')

**Returns:** `Promise<ChapterResponse>`

**Throws:** Error if chapter ID is invalid (< 1 or > 114)

**Example:**
```typescript
const { chapter } = await getChapter(2);
console.log(chapter.name_simple); // "Al-Baqarah"

// With language
const { chapter: chapterFr } = await getChapter(2, 'fr');
```

### `getVerse(chapterId: number, verseNumber: number, language?: string, includeTranslations?: boolean)`

Fetches a single verse by chapter ID and verse number, optionally with translations.

**Parameters:**
- `chapterId` (number): Chapter ID, must be between 1 and 114
- `verseNumber` (number): Verse number within the chapter, must be greater than 0
- `language` (string, optional): Language code for localized content (e.g., 'en', 'fr', 'ar')
- `includeTranslations` (boolean, optional): Whether to include translations (default: false)

**Returns:** `Promise<VerseResponse>`

**Throws:** Error if chapter ID or verse number is invalid

**Example:**
```typescript
// Without translation
const { verse } = await getVerse(2, 5);
console.log(verse.verse_key); // "2:5"

// With translation
const { verse } = await getVerse(2, 5, 'en', true);
console.log(verse.text_uthmani); // Arabic text
console.log(verse.translations); // Array of translations
```

### `getVersesByRange(chapterId: number, startVerse: number, endVerse: number | null, language?: string, includeTranslations?: boolean)`

Fetches multiple verses in a range.

**Parameters:**
- `chapterId` (number): Chapter ID, must be between 1 and 114
- `startVerse` (number): Starting verse number
- `endVerse` (number | null): Ending verse number (null for single verse)
- `language` (string, optional): Language code
- `includeTranslations` (boolean, optional): Whether to include translations (default: false)

**Returns:** `Promise<VersesResponse>`

**Throws:** Error if chapter ID or verse numbers are invalid

**Example:**
```typescript
// Fetch verses 1-5 of chapter 2 with translations
const { verses } = await getVersesByRange(2, 1, 5, 'en', true);
console.log(verses.length); // 5
```

### `getTranslationId(language: string)`

Gets the translation resource ID for a specific language. Results are cached to minimize API calls.

**Parameters:**
- `language` (string): Language code (e.g., 'en', 'fr')

**Returns:** `Promise<number>` - Translation resource ID

**Example:**
```typescript
const translationId = await getTranslationId('en');
// Returns: 131 (Dr. Mustafa Khattab, the Clear Quran)
```

### Types

```typescript
interface ChaptersResponse {
  chapters: Chapter[];
}

interface ChapterResponse {
  chapter: Chapter;
}

interface VerseResponse {
  verse: Verse;
}

interface Chapter {
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

interface Verse {
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
  text_uthmani?: string;         // Arabic text (when requested)
  translations?: Translation[];   // Translations (when requested)
}

interface Translation {
  id: number;
  resource_id: number;
  text: string;
  resource_name?: string;
  language_name?: string;
}

interface VersesResponse {
  verses: Verse[];
}
```

## Extending the API Client

To add more endpoints:

1. Add response types to `lib/api/clients/quran/types.ts`
2. Add the method to `lib/api/clients/quran/client.ts` using `makeAuthenticatedRequest()`
3. Export the method from `lib/api/clients/quran/index.ts`
4. Update documentation

**Example:**
```typescript
// In lib/api/clients/quran/types.ts
export interface JuzResponse {
  juz: Juz;
}

// In lib/api/clients/quran/client.ts
import { makeAuthenticatedRequest } from './request';

export async function getJuz(id: number, language?: string): Promise<JuzResponse> {
  if (id < 1 || id > 30) {
    throw new Error('Invalid juz ID. Must be between 1 and 30.');
  }
  return makeAuthenticatedRequest<JuzResponse>(`/juzs/${id}`, language);
}

// In lib/api/clients/quran/index.ts
export { getJuz } from './client';
export type { JuzResponse } from './types';
```

The `makeAuthenticatedRequest()` function from `request.ts` handles all authentication, headers, and error handling automatically.

## Topics Taxonomy Services

The service layer (`lib/api/services/`) provides database operations for managing topics, categories, subcategories, items, and their Quran references. Each entity has its own service module that mirrors the API route structure.

### Service Modules

- **Topics** (`lib/api/services/topics/`) - Manage topics
- **Categories** (`lib/api/services/categories/`) - Manage categories
- **Subcategories** (`lib/api/services/subcategories/`) - Manage subcategories  
- **Items** (`lib/api/services/items/`) - Manage items with Quran references

### Centralized Types

All type definitions are centralized in `lib/api/services/types.ts` for easy sharing across services.

**Import examples:**
```typescript
// Import from specific services
import { getTopics, getTopicById } from '@/lib/api/services/topics';
import { getCategories, getCategory } from '@/lib/api/services/categories';
import { getItems, getItem, searchItems } from '@/lib/api/services/items';

// Import types from centralized location
import type { TopicWithTranslations, CategoryWithTranslations } from '@/lib/api/services/types';

// Perform a search across items (label match with optional language filter)
const items = await searchItems('unicité', 'fr');
```

### Items Search Helper

- **Function:** `searchItems(query: string, language?: string): Promise<ItemWithDetails[]>`
- **Purpose:** Shared helper for the `GET /api/items/search` route and server components, ensuring search logic stays server-side.
- **Current behavior:** Performs a `LIKE` search on `item_translations.label`, optionally filtered by `language_code`, and returns each matching item with its translations and Quran references.
- **Usage Example:**
  ```typescript
  import { searchItems } from '@/lib/api/services/items';

  export async function SearchResults({ q, locale }: { q: string; locale: string }) {
    const items = await searchItems(q, locale);
    return items.map((item) => item.slug);
  }
  ```

## Security Notes

- **Never commit `.env.local`** - It's in `.gitignore` by default
- All API calls should be server-side only (Server Components, Server Actions, or API Routes)
- Tokens are cached in memory and never exposed to the client
- Environment variables are only accessible in server-side code

## Troubleshooting

### "Environment variable is not set" error

Make sure you've created `.env.local` in the project root with all required variables.

### OAuth2 authentication fails

1. Check that `QURAN_CLIENT_ID` and `QURAN_CLIENT_SECRET` are correct
2. Verify the `QURAN_AUTH_API_BASE_URL` is accessible
3. Check that the client credentials grant type is enabled for your client

### API request fails

1. Verify the token is being fetched correctly (check console logs)
2. Ensure the `x-auth-token` and `x-client-id` headers are being sent
3. Check that the content API endpoint is correct

## License

This integration is part of the quran-interview project.

