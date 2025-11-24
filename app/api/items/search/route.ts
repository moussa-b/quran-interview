import { NextRequest, NextResponse } from 'next/server';
import { searchItems } from '@/lib/api/services/items';
import type { ItemSearchResponse } from '@/lib/api/services/types';

/**
 * GET /api/items/search
 *
 * Perform a search against items.
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
      const emptyResponse: ItemSearchResponse = { items: [] };
      return NextResponse.json(emptyResponse);
    }

    const items = await searchItems(query, language);
    const response: ItemSearchResponse = { items };

    return NextResponse.json(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error searching items:', err);

    return NextResponse.json(
      { error: 'Failed to search items', message: err.message },
      { status: 500 }
    );
  }
}
