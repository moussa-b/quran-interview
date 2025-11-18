# Quran Foundation API Integration

This directory contains the API client for integrating with the Quran Foundation API, including OAuth2 authentication and content fetching.

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
import { getChapters } from '@/lib/api/quran-client';

export default async function ChaptersPage() {
  try {
    const data = await getChapters();
    
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
import { getChapter } from '@/lib/api/quran-client';

export default async function ChapterPage({ params }: { params: { id: string } }) {
  try {
    const { chapter } = await getChapter(parseInt(params.id));
    
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
import { getVerse } from '@/lib/api/quran-client';

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

### Files

- **`types.ts`**: TypeScript type definitions for API responses
- **`auth.ts`**: OAuth2 token manager with automatic caching and refresh
- **`quran-client.ts`**: Main API client with methods for fetching data

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

### `getChapters()`

Fetches all chapters (Surahs) from the Quran.

**Returns:** `Promise<ChaptersResponse>`

**Example:**
```typescript
const { chapters } = await getChapters();
console.log(chapters.length); // 114
```

### `getChapter(id: number)`

Fetches a single chapter by ID (1-114).

**Parameters:**
- `id` (number): Chapter ID, must be between 1 and 114

**Returns:** `Promise<ChapterResponse>`

**Throws:** Error if chapter ID is invalid (< 1 or > 114)

**Example:**
```typescript
const { chapter } = await getChapter(2);
console.log(chapter.name_simple); // "Al-Baqarah"
```

### `getVerse(chapterId: number, verseNumber: number)`

Fetches a single verse by chapter ID and verse number.

**Parameters:**
- `chapterId` (number): Chapter ID, must be between 1 and 114
- `verseNumber` (number): Verse number within the chapter, must be greater than 0

**Returns:** `Promise<VerseResponse>`

**Throws:** Error if chapter ID or verse number is invalid

**Example:**
```typescript
const { verse } = await getVerse(2, 5);
console.log(verse.verse_key); // "2:5"
console.log(verse.page_number); // 2
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

To add more endpoints, extend the `quran-client.ts` file:

```typescript
// In quran-client.ts

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

Don't forget to add corresponding TypeScript types in `types.ts` and export them in `index.ts`.

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

