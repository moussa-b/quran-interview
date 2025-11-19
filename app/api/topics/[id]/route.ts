import { NextRequest, NextResponse } from 'next/server';
import { getTopicById } from '@/lib/api/services/topics';
import type { TopicResponse } from '@/lib/api/services/types';

/**
 * GET /api/topics/[id]
 * 
 * Fetch a single topic by ID with translations
 * 
 * Query parameters:
 * - language (optional): Language code to filter translations (e.g., 'en', 'fr')
 * 
 * @example
 * GET /api/topics/1
 * GET /api/topics/1?language=en
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const topicId = parseInt(id, 10);

    if (isNaN(topicId)) {
      return NextResponse.json(
        { error: 'Invalid topic ID' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || undefined;

    const topic = await getTopicById(topicId, language);

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    const response: TopicResponse = {
      topic,
    };

    return NextResponse.json(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching topic:', err);

    return NextResponse.json(
      { error: 'Failed to fetch topic', message: err.message },
      { status: 500 }
    );
  }
}

