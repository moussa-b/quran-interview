import { NextResponse } from 'next/server';
import { getChapter } from '@/lib/api/clients/quran';

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const chapterId = parseInt(id, 10);

    if (isNaN(chapterId) || chapterId < 1 || chapterId > 114) {
      return NextResponse.json(
        { error: 'Invalid chapter ID. Must be between 1 and 114.' },
        { status: 400 }
      );
    }

    // Extract language from query params (optional)
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';

    const response = await getChapter(chapterId, language);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapter information' },
      { status: 500 }
    );
  }
}

