import { NextRequest, NextResponse } from 'next/server';
import { getItems } from '@/lib/api/services/items';
import type { ItemsResponse } from '@/lib/api/services/types';

/**
 * GET /api/items
 * 
 * Fetch all items with their translations and Quran references
 * 
 * Query parameters:
 * - category_id (optional): Filter by category ID
 * - subcategory_id (optional): Filter by subcategory ID
 * - language (optional): Language code to filter translations (e.g., 'en', 'fr')
 * 
 * Note: If both category_id and subcategory_id are provided, category_id takes precedence
 * 
 * @example
 * GET /api/items
 * GET /api/items?category_id=1
 * GET /api/items?subcategory_id=1
 * GET /api/items?subcategory_id=1&language=en
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryIdParam = searchParams.get('category_id');
    const subcategoryIdParam = searchParams.get('subcategory_id');
    const language = searchParams.get('language') || undefined;

    let categoryId: number | undefined;
    let subcategoryId: number | undefined;

    if (categoryIdParam) {
      categoryId = parseInt(categoryIdParam, 10);
      if (isNaN(categoryId)) {
        return NextResponse.json(
          { error: 'Invalid category_id parameter' },
          { status: 400 }
        );
      }
    }

    if (subcategoryIdParam) {
      subcategoryId = parseInt(subcategoryIdParam, 10);
      if (isNaN(subcategoryId)) {
        return NextResponse.json(
          { error: 'Invalid subcategory_id parameter' },
          { status: 400 }
        );
      }
    }

    const items = await getItems(categoryId, subcategoryId, language);

    const response: ItemsResponse = {
      items,
    };

    return NextResponse.json(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching items:', err);

    return NextResponse.json(
      { error: 'Failed to fetch items', message: err.message },
      { status: 500 }
    );
  }
}

