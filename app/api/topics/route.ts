import { NextRequest, NextResponse } from 'next/server';
import { getTopics } from '@/lib/api/services/topics';
import type { TopicsResponse } from '@/lib/api/services/types';

/**
 * GET /api/topics
 * 
 * Fetch all topics with their translations
 * 
 * Query parameters:
 * - language (optional): Language code to filter translations (e.g., 'en', 'fr')
 * 
 * @example
 * GET /api/topics
 * GET /api/topics?language=en
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || undefined;

    const topics = await getTopics(language);

    const response: TopicsResponse = {
      topics,
    };

    return NextResponse.json(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching topics:', err);

    return NextResponse.json(
      { error: 'Failed to fetch topics', message: err.message },
      { status: 500 }
    );
  }
}

