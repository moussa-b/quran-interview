## About This Project

This is a demo project created to apply for the **Full-Stack Engineer** position at Quran Foundation. You can find the job posting here: [Quran Foundation - Full-Stack Engineer](https://quran.foundation/careers/full-stack-engineer)

### Important Notice

The data used in this project is **only for POC (Proof of Concept) purposes** for the interview process. The data has **not been fully tested and validated** and should not be considered production-ready.

---

## Project Overview

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

The UI stack combines [shadcn/ui](https://ui.shadcn.com) for composable components.

## Getting Started

### 1. Environment Setup

Create a `.env.local` file in the project root with the following variables:

```bash
# Quran Foundation API Configuration
QURAN_AUTH_API_BASE_URL=https://prelive-oauth2.quran.foundation
QURAN_CONTENT_API_BASE_URL=https://apis-prelive.quran.foundation/content/api/v4
QURAN_CLIENT_ID=your_client_id_here
QURAN_CLIENT_SECRET=your_client_secret_here

# Database Configuration (for local development)
DB_HOST=localhost
DB_PORT=3308
DB_USER=nextjs
DB_PASSWORD=nextjs
DB_NAME=quran
```

**Important:** Replace `your_client_secret_here` with your actual client secret from Quran Foundation.

### 2. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the localized home page by modifying `app/[locale]/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Internationalization & Proxy

The UI is localized with a dedicated `[locale]` segment under `app/`, so every route is rendered inside `app/[locale]/…`. English (`en`) and French (`fr`) ship with the repo, and the active locale is enforced by the proxy and stored in the `NEXT_LOCALE` cookie.

- Translations are stored in `locales/<locale>/common.json`.
- `lib/i18n/config.ts` defines the supported locales, exposes helpers such as `getDictionary`, and exports display names for the language switcher.
- `components/i18n/I18nProvider.tsx` hydrates the dictionary on the client, while server components can call `getDictionary(locale)` directly.
- `LanguageDropdown` reads from the provider and rewrites the current pathname so switching between locales keeps you on the same page.

A root-level [`proxy.ts`](./proxy.ts) intercepts every request (except static assets/API routes) to enforce localized URLs. If a user visits `/` it:

1. Detects the best locale via the `NEXT_LOCALE` cookie (if present) or the `Accept-Language` header.
2. Redirects the user to `/<locale>/...` and persists the choice in the `NEXT_LOCALE` cookie for subsequent requests.

See the [Next.js proxy docs](https://nextjs.org/docs/app/api-reference/file-conventions/proxy) for additional details on how matchers work or how to customize the redirect logic.

### Adding another locale

1. Add the locale code to `locales` in `lib/i18n/config.ts` (and its display name to `localeDisplayNames`).
2. Create `locales/<new-locale>/common.json`, keeping the same key structure as the existing files.
3. Update any server components that call `getDictionary` directly if they need locale-specific metadata.
4. Restart `next dev` so the new route segment is discovered and statically generated.

## Quran Foundation API Integration

The project includes a fully-typed API client for the Quran Foundation API with OAuth2 authentication. See [`lib/api/README.md`](./lib/api/README.md) for detailed documentation.

### Quick Examples

```typescript
import { getChapters, getChapter, getVerse, getVersesByRange } from '@/lib/api';

// Fetch all chapters with language support
export default async function ChaptersPage({ locale }: { locale: string }) {
  const { chapters } = await getChapters(locale);
  
  return (
    <ul>
      {chapters.map((chapter) => (
        <li key={chapter.id}>
          {chapter.id}. {chapter.name_simple} - {chapter.name_arabic}
        </li>
      ))}
    </ul>
  );
}

// Fetch a single chapter
export async function ChapterDetailPage({ id, locale }: { id: number; locale: string }) {
  const { chapter } = await getChapter(id, locale);
  
  return (
    <div>
      <h1>{chapter.name_simple}</h1>
      <p>{chapter.translated_name.name}</p>
      <p>Verses: {chapter.verses_count}</p>
    </div>
  );
}

// Fetch a single verse with translation
export async function VersePage({ 
  chapterId, 
  verseNumber, 
  locale 
}: { 
  chapterId: number; 
  verseNumber: number; 
  locale: string 
}) {
  const { verse } = await getVerse(chapterId, verseNumber, locale, true);
  
  return (
    <div>
      <h2>Verse {verse.verse_key}</h2>
      {verse.text_uthmani && (
        <p className="arabic text-2xl" dir="rtl">{verse.text_uthmani}</p>
      )}
      {verse.translations && verse.translations[0] && (
        <p>{verse.translations[0].text}</p>
      )}
      <p>Page: {verse.page_number} | Juz: {verse.juz_number}</p>
    </div>
  );
}

// Fetch a range of verses
export async function VersesRangePage({ 
  chapterId, 
  startVerse,
  endVerse,
  locale 
}: { 
  chapterId: number; 
  startVerse: number;
  endVerse: number;
  locale: string 
}) {
  const { verses } = await getVersesByRange(chapterId, startVerse, endVerse, locale, true);
  
  return (
    <div>
      {verses.map((verse) => (
        <div key={verse.id}>
          <h3>Verse {verse.verse_number}</h3>
          {verse.text_uthmani && <p dir="rtl">{verse.text_uthmani}</p>}
          {verse.translations?.[0] && <p>{verse.translations[0].text}</p>}
        </div>
      ))}
    </div>
  );
}
```

The API client handles:
- ✅ OAuth2 authentication with automatic token refresh
- ✅ Token caching to minimize authentication requests
- ✅ Translation management with intelligent caching
- ✅ Verse range queries for batch fetching
- ✅ Full TypeScript support
- ✅ Error handling and validation

## Health Check Endpoint

The application includes a health check endpoint at `/api/health` that monitors:
- ✅ MySQL database connectivity
- ✅ Quran Foundation API availability

### Endpoint Details

**URL:** `GET /api/health`

**Response:**
- `200 OK` - All services are healthy
- `503 Service Unavailable` - One or more services are unhealthy

**Response Format:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-18T12:00:00.000Z",
  "services": {
    "database": {
      "status": "healthy",
      "timestamp": "2025-11-18T12:00:00.000Z"
    },
    "quranApi": {
      "status": "healthy",
      "timestamp": "2025-11-18T12:00:00.000Z"
    }
  }
}
```

This endpoint is designed to be polled by external monitoring bots (e.g., every 5 minutes) to ensure all critical services are operational.

## Local Database (MySQL)

A ready-made Docker Compose stack lives in `docs/db/docker-compose.yml`. It provisions MySQL, runs the schema/seed script from `docs/db/create_db.sql`, and exposes the database on port `3308`.

1. Start Docker Desktop (or your preferred Docker runtime).
2. From the repository root run:

   ```bash
   cd docs/db
   docker compose up -d
   ```

3. Wait for the `quran_interview_mysql` container to report `healthy` (`docker compose ps`).
4. Connect with any MySQL client using `mysql://nextjs:nextjs@127.0.0.1:3308/quran`.

To stop the database:

```shell
docker compose down
```

To wipe the `quran_mysql_data` volume and reload the schema on the next start:

```shell
docker compose down -v
```

## Using Docker

1. [Install Docker](https://docs.docker.com/get-docker/) on your machine.

2.Build your container:
```bash
# For npm, pnpm or yarn
docker build -t nextjs-docker .
```

3. Run your container temporarily: 
```bash
docker run --rm --name quran-interview-nextjs-app -p 3000:3000 nextjs-docker
```

4. Or run your container and keep it :
```bash
docker run --name quran-interview-nextjs-app -p 3000:3000 nextjs-docker
```

You can view your images created with `docker images`.

### In existing projects

To add Docker support, copy [`Dockerfile`](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile) to the project root. If using Bun, copy [`Dockerfile.bun`](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile.bun) instead. Then add the following to next.config.js:

```js
// next.config.js
module.exports = {
  // ... rest of the configuration.
  output: "standalone",
};
```

This will build the project as a standalone app inside the Docker image.

## Automated Docker Hub Publishing

The workflow in `.github/workflows/docker-publish.yml` builds the container image with Docker Buildx and pushes it to [Docker Hub](https://hub.docker.com/) whenever changes land on `main` (you can also run it manually with the **Run workflow** button). To enable it:

1. Create (or pick) a public/private repository in your Docker Hub account where the `quran-interview` image should live.
2. In the GitHub repository settings, add the following secrets under **Settings → Secrets and variables → Actions**:
   - `DOCKERHUB_USERNAME`: your Docker Hub username.
   - `DOCKERHUB_TOKEN`: a Docker Hub access token (create one from **Account Settings → Security → New Access Token**).
3. Once the secrets are in place, every push to `main` will produce and push the tags `latest`, the branch/tag name, the commit SHA, and an auto-incrementing semantic tag `v<run-number>` that increments with each workflow execution (e.g., `v12`, `v13`, ...). This gives you a monotonically increasing version you can use in deployments without having to create Git tags manually.

By default the images are published as `DOCKERHUB_USERNAME/quran-interview`. Edit the `IMAGE_NAME` value inside the workflow if you prefer a different repository or organization.
