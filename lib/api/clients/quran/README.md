# Quran Foundation API Client

This directory contains the client implementation for integrating with the Quran Foundation API, including OAuth2 authentication and content fetching.

## Overview

The Quran client provides typed, authenticated access to the Quran Foundation API's content endpoints. It handles OAuth2 token management automatically with caching and refresh.

## Files

- **`client.ts`** - Main API client with methods for fetching chapters and verses
- **`auth.ts`** - OAuth2 token manager with automatic caching and refresh
- **`types.ts`** - TypeScript type definitions for API requests and responses
- **`index.ts`** - Barrel exports for convenient imports

## Usage

```typescript
import { getChapters, getChapter, getVerse } from '@/lib/api/clients/quran';

// Fetch all chapters
const { chapters } = await getChapters('en');

// Fetch a specific chapter
const { chapter } = await getChapter(2, 'fr');

// Fetch a specific verse
const { verse } = await getVerse(2, 255);
```

## Environment Variables

Required environment variables (set in `.env.local`):

```bash
QURAN_AUTH_API_BASE_URL=https://prelive-oauth2.quran.foundation
QURAN_CONTENT_API_BASE_URL=https://apis-prelive.quran.foundation/content/api/v4
QURAN_CLIENT_ID=your_client_id_here
QURAN_CLIENT_SECRET=your_client_secret_here
```

## Token Management

The OAuth2 token manager:
- Automatically fetches access tokens using client credentials
- Caches tokens in memory
- Auto-refreshes tokens before expiration (60s buffer)
- Uses Basic Authentication (client_id:client_secret)

## API Flow

```
1. Application calls getChapters() or other method
2. auth.ts checks if cached token is valid
3. If invalid/expired, fetch new token from OAuth2 endpoint
4. Make authenticated request to content API with token
5. Return typed response
```

## Available Methods

### `getChapters(language?: string): Promise<ChaptersResponse>`

Fetches all 114 chapters of the Quran.

### `getChapter(id: number, language?: string): Promise<ChapterResponse>`

Fetches a single chapter by ID (1-114).

### `getVerse(chapterId: number, verseNumber: number, language?: string): Promise<VerseResponse>`

Fetches a single verse by chapter ID and verse number.

## Extending

To add more endpoints:

1. Add the method to `client.ts`
2. Add corresponding types to `types.ts`
3. Export from `index.ts`
4. Update this README

## Security

- All API calls are server-side only
- Tokens are never exposed to the client
- Environment variables are only accessible server-side
- Never commit `.env.local` to version control

