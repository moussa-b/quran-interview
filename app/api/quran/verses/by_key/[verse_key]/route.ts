import { NextResponse } from 'next/server';
import { getVersesByRange } from '@/lib/api/clients/quran';

type RouteParams = {
  params: Promise<{
    verse_key: string;
  }>;
};

/**
 * Parse verse key to extract chapter, start verse, and optional end verse
 * Supports formats: "2:5" (single verse) or "2:5-10" (range)
 */
function parseVerseKey(verseKey: string): {
  chapter: number;
  startVerse: number;
  endVerse: number | null;
} {
  const parts = verseKey.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid verse key format. Expected format: "chapter:verse" or "chapter:verse-verse"');
  }

  const chapter = parseInt(parts[0], 10);
  if (isNaN(chapter) || chapter < 1 || chapter > 114) {
    throw new Error('Invalid chapter number. Must be between 1 and 114.');
  }

  const versePart = parts[1];
  if (versePart.includes('-')) {
    // Range format: "2:5-10"
    const verseRange = versePart.split('-');
    if (verseRange.length !== 2) {
      throw new Error('Invalid verse range format. Expected format: "chapter:verse-verse"');
    }

    const startVerse = parseInt(verseRange[0], 10);
    const endVerse = parseInt(verseRange[1], 10);

    if (isNaN(startVerse) || startVerse < 1) {
      throw new Error('Invalid start verse number.');
    }
    if (isNaN(endVerse) || endVerse < 1) {
      throw new Error('Invalid end verse number.');
    }
    if (endVerse < startVerse) {
      throw new Error('End verse must be greater than or equal to start verse.');
    }

    return { chapter, startVerse, endVerse };
  } else {
    // Single verse format: "2:5"
    const startVerse = parseInt(versePart, 10);
    if (isNaN(startVerse) || startVerse < 1) {
      throw new Error('Invalid verse number.');
    }

    return { chapter, startVerse, endVerse: null };
  }
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { verse_key } = await params;

    // Parse verse key
    const { chapter, startVerse, endVerse } = parseVerseKey(verse_key);

    // Extract language from query params (optional)
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';

    // Fetch verses with translations
    const response = await getVersesByRange(
      chapter,
      startVerse,
      endVerse,
      language,
      true // Include translations
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching verses:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch verse information' },
      { status: 500 }
    );
  }
}

