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
│       ├── auth.ts
│       ├── client.ts
│       ├── types.ts
│       ├── index.ts
│       └── README.md
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

The Quran client (`lib/api/clients/quran/`) provides integration with the Quran Foundation API, including OAuth2 authentication and content fetching.

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
  params: { chapterId: string; verseNumber: string } 
}) {
  try {
    const { verse } = await getVerse(
      parseInt(params.chapterId),
      parseInt(params.verseNumber)
    );
    
    return (
      <div>
        <h1>Verse {verse.verse_key}</h1>
        <p>Page: {verse.page_number}</p>
        <p>Juz: {verse.juz_number}</p>
        <p>Hizb: {verse.hizb_number}</p>
        {verse.sajdah_number && <p>Sajdah: {verse.sajdah_number}</p>}
      </div>
    );
  } catch (error) {
    console.error('Error fetching verse:', error);
    return <div>Error loading verse</div>;
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

- **`types.ts`**: TypeScript type definitions for API responses
- **`auth.ts`**: OAuth2 token manager with automatic caching and refresh
- **`client.ts`**: Main API client with methods for fetching data
- **`index.ts`**: Barrel exports for easy importing

### Token Management

The OAuth2 token manager:
- Automatically fetches access tokens using client credentials
- Caches tokens in memory
- Auto-refreshes tokens before expiration (60s buffer)
- Uses Basic Authentication (client_id:client_secret)

### API Flow

```
1. Call getChapters()
2. auth.ts checks if cached token is valid
3. If invalid/expired, fetch new token from OAuth2 endpoint
4. Make authenticated request to content API
5. Return typed response
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

### `getVerse(chapterId: number, verseNumber: number, language?: string)`

Fetches a single verse by chapter ID and verse number.

**Parameters:**
- `chapterId` (number): Chapter ID, must be between 1 and 114
- `verseNumber` (number): Verse number within the chapter, must be greater than 0
- `language` (string, optional): Language code for localized content (e.g., 'en', 'fr', 'ar')

**Returns:** `Promise<VerseResponse>`

**Throws:** Error if chapter ID or verse number is invalid

**Example:**
```typescript
const { verse } = await getVerse(2, 5);
console.log(verse.verse_key); // "2:5"
console.log(verse.page_number); // 2

// With language
const { verse: verseFr } = await getVerse(2, 5, 'fr');
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
}
```

## Extending the API Client

To add more endpoints, extend the `lib/api/clients/quran/client.ts` file:

```typescript
// In lib/api/clients/quran/client.ts

export async function getChapterVerses(chapterId: number): Promise<ChapterVersesResponse> {
  if (chapterId < 1 || chapterId > 114) {
    throw new Error(`Invalid chapter ID: ${chapterId}. Must be between 1 and 114.`);
  }
  return makeAuthenticatedRequest<ChapterVersesResponse>(`/chapters/${chapterId}/verses`);
}

// Add to quranClient object
export const quranClient = {
  getChapters,
  getChapter,
  getVerse,
  getChapterVerses, // <-- Add here
};
```

Don't forget to add corresponding TypeScript types in `lib/api/clients/quran/types.ts` and export them in `lib/api/clients/quran/index.ts`.

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
import { getItems, getItem } from '@/lib/api/services/items';

// Import types from centralized location
import type { TopicWithTranslations, CategoryWithTranslations } from '@/lib/api/services/types';
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

