import { NextRequest, NextResponse } from 'next/server';
import { searchTopics } from '@/lib/api/services/topics';
import type { ItemsResponse } from '@/lib/api/services/types';

/**
 * GET /api/topics/search
 *
 * Perform a search against topic items.
 *
 * Query parameters:
 * - q (required): Search term
 * - language (optional): Language code (e.g., 'en', 'fr')
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryParam = searchParams.get('q') || '';
    const query = queryParam.trim();
    const language = searchParams.get('language') || undefined;

    if (!query) {
      const emptyResponse: ItemsResponse = { items: [] };
      return NextResponse.json(emptyResponse);
    }

    const items = await searchTopics(query, language);
    const response: ItemsResponse = { items };

    return NextResponse.json(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error searching topics:', err);

    return NextResponse.json(
      { error: 'Failed to search topics', message: err.message },
      { status: 500 }
    );
  }
}
