import { NextRequest, NextResponse } from 'next/server';
import { getItem } from '@/lib/api/services/items';
import type { ItemResponse } from '@/lib/api/services/types';

/**
 * GET /api/items/[id]
 * 
 * Fetch a single item by ID with translations and Quran references
 * 
 * Query parameters:
 * - language (optional): Language code to filter translations (e.g., 'en', 'fr')
 * 
 * @example
 * GET /api/items/340
 * GET /api/items/340?language=en
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const itemId = parseInt(id, 10);

    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid item ID' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || undefined;

    const item = await getItem(itemId, language);

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    const response: ItemResponse = {
      item,
    };

    return NextResponse.json(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching item:', err);

    return NextResponse.json(
      { error: 'Failed to fetch item', message: err.message },
      { status: 500 }
    );
  }
}

