import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '@/lib/api/services/categories';
import type { CategoriesResponse } from '@/lib/api/services/types';

/**
 * GET /api/categories
 * 
 * Fetch all categories with their translations
 * 
 * Query parameters:
 * - topic_id (optional): Filter by topic ID
 * - language (optional): Language code to filter translations (e.g., 'en', 'fr')
 * 
 * @example
 * GET /api/categories
 * GET /api/categories?topic_id=1
 * GET /api/categories?topic_id=1&language=en
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topicIdParam = searchParams.get('topic_id');
    const language = searchParams.get('language') || undefined;

    let topicId: number | undefined;
    if (topicIdParam) {
      topicId = parseInt(topicIdParam, 10);
      if (isNaN(topicId)) {
        return NextResponse.json(
          { error: 'Invalid topic_id parameter' },
          { status: 400 }
        );
      }
    }

    const categories = await getCategories(topicId, language);

    const response: CategoriesResponse = {
      categories,
    };

    return NextResponse.json(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching categories:', err);

    return NextResponse.json(
      { error: 'Failed to fetch categories', message: err.message },
      { status: 500 }
    );
  }
}

