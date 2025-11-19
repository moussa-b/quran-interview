import { NextRequest, NextResponse } from 'next/server';
import { getSubcategories } from '@/lib/api/services/subcategories';
import type { SubcategoriesResponse } from '@/lib/api/services/types';

/**
 * GET /api/subcategories
 * 
 * Fetch all subcategories with their translations
 * 
 * Query parameters:
 * - category_id (optional): Filter by category ID
 * - language (optional): Language code to filter translations (e.g., 'en', 'fr')
 * 
 * @example
 * GET /api/subcategories
 * GET /api/subcategories?category_id=1
 * GET /api/subcategories?category_id=1&language=en
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryIdParam = searchParams.get('category_id');
    const language = searchParams.get('language') || undefined;

    let categoryId: number | undefined;
    if (categoryIdParam) {
      categoryId = parseInt(categoryIdParam, 10);
      if (isNaN(categoryId)) {
        return NextResponse.json(
          { error: 'Invalid category_id parameter' },
          { status: 400 }
        );
      }
    }

    const subcategories = await getSubcategories(categoryId, language);

    const response: SubcategoriesResponse = {
      subcategories,
    };

    return NextResponse.json(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching subcategories:', err);

    return NextResponse.json(
      { error: 'Failed to fetch subcategories', message: err.message },
      { status: 500 }
    );
  }
}

