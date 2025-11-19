import { NextRequest, NextResponse } from 'next/server';
import { getSubcategory } from '@/lib/api/services/subcategories';
import type { SubcategoryResponse } from '@/lib/api/services/types';

/**
 * GET /api/subcategories/[id]
 * 
 * Fetch a single subcategory by ID with translations
 * 
 * Query parameters:
 * - language (optional): Language code to filter translations (e.g., 'en', 'fr')
 * 
 * @example
 * GET /api/subcategories/1
 * GET /api/subcategories/1?language=en
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const subcategoryId = parseInt(id, 10);

    if (isNaN(subcategoryId)) {
      return NextResponse.json(
        { error: 'Invalid subcategory ID' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || undefined;

    const subcategory = await getSubcategory(subcategoryId, language);

    if (!subcategory) {
      return NextResponse.json(
        { error: 'Subcategory not found' },
        { status: 404 }
      );
    }

    const response: SubcategoryResponse = {
      subcategory,
    };

    return NextResponse.json(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching subcategory:', err);

    return NextResponse.json(
      { error: 'Failed to fetch subcategory', message: err.message },
      { status: 500 }
    );
  }
}

