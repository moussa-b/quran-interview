import { NextResponse } from 'next/server';
import { getChapters } from '@/lib/api/clients/quran';

export async function GET(request: Request) {
  try {
    // Extract language from query params (optional)
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'en';

    const response = await getChapters(language);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapters' },
      { status: 500 }
    );
  }
}

