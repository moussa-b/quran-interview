import { NextRequest, NextResponse } from 'next/server';
import { getCategory } from '@/lib/api/services/categories';
import type { CategoryResponse } from '@/lib/api/services/types';

/**
 * GET /api/categories/[id]
 * 
 * Fetch a single category by ID with translations
 * 
 * Query parameters:
 * - language (optional): Language code to filter translations (e.g., 'en', 'fr')
 * 
 * @example
 * GET /api/categories/1
 * GET /api/categories/1?language=en
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id, 10);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || undefined;

    const category = await getCategory(categoryId, language);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const response: CategoryResponse = {
      category,
    };

    return NextResponse.json(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching category:', err);

    return NextResponse.json(
      { error: 'Failed to fetch category', message: err.message },
      { status: 500 }
    );
  }
}

