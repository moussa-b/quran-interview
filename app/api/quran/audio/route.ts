import { NextResponse } from 'next/server'
import { getVerseAudio } from '@/lib/api/clients/quran'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const chapterParam = searchParams.get('chapter')
    const verseParam = searchParams.get('verse')
    const recitationParam = searchParams.get('recitationId')

    if (!chapterParam || !verseParam) {
      return NextResponse.json(
        { error: 'Missing required query params: chapter and verse.' },
        { status: 400 }
      )
    }

    const chapter = Number(chapterParam)
    const verse = Number(verseParam)
    const recitationId = recitationParam ? Number(recitationParam) : undefined

    if (!Number.isInteger(chapter) || chapter < 1 || chapter > 114) {
      return NextResponse.json(
        { error: 'Invalid chapter parameter. Must be an integer between 1 and 114.' },
        { status: 400 }
      )
    }

    if (!Number.isInteger(verse) || verse < 1) {
      return NextResponse.json(
        { error: 'Invalid verse parameter. Must be an integer greater than 0.' },
        { status: 400 }
      )
    }

    if (recitationParam && (!Number.isInteger(recitationId) || recitationId! < 1)) {
      return NextResponse.json(
        { error: 'Invalid recitationId parameter. Must be a positive integer.' },
        { status: 400 }
      )
    }

    const audio = await getVerseAudio(chapter, verse, recitationId)

    return NextResponse.json({ audio })
  } catch (error) {
    console.error('Error fetching verse audio metadata:', error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to fetch verse audio' }, { status: 500 })
  }
}


