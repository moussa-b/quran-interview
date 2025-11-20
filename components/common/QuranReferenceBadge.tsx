'use client'

import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { VerseDisplay } from './VerseDisplay'
import { useTranslations, useLocale } from '@/components/i18n/I18nProvider'
import type { ItemQuranRef } from '@/lib/api/services/types'
import type { Chapter, Verse } from '@/lib/api/clients/quran'

interface QuranReferenceBadgeProps {
  reference: ItemQuranRef
  variant: 'blue' | 'green'
}

type ViewMode = 'chapter' | 'verse'

// Helper function to format Quran references
function formatQuranRef(chapter: number, startVerse: number, endVerse: number | null): string {
  if (endVerse !== null && endVerse !== startVerse) {
    return `${chapter}:${startVerse}-${endVerse}`
  }
  return `${chapter}:${startVerse}`
}

// Helper function to create verse key for API
function createVerseKey(chapter: number, startVerse: number, endVerse: number | null): string {
  if (endVerse !== null && endVerse !== startVerse) {
    return `${chapter}:${startVerse}-${endVerse}`
  }
  return `${chapter}:${startVerse}`
}

export function QuranReferenceBadge({ reference, variant }: QuranReferenceBadgeProps) {
  const tVerse = useTranslations('verse')
  const tChapter = useTranslations('chapter')
  const locale = useLocale()
  const [open, setOpen] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<ViewMode>('chapter')
  const [chapter, setChapter] = React.useState<Chapter | null>(null)
  const [verses, setVerses] = React.useState<Verse[]>([])
  const [chapterLoading, setChapterLoading] = React.useState(false)
  const [verseLoading, setVerseLoading] = React.useState(false)
  const [chapterError, setChapterError] = React.useState<string | null>(null)
  const [verseError, setVerseError] = React.useState<string | null>(null)

  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    green: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  }

  // Fetch chapter info when popover opens in chapter mode
  React.useEffect(() => {
    if (open && viewMode === 'chapter' && !chapter) {
      setChapterLoading(true)
      setChapterError(null)

      fetch(`/api/quran/chapters/${reference.chapter}?language=${locale}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then((response) => {
          setChapter(response.chapter)
        })
        .catch((err) => {
          console.error('Failed to fetch chapter:', err)
          setChapterError('Failed to load chapter information')
        })
        .finally(() => {
          setChapterLoading(false)
        })
    }
  }, [open, viewMode, chapter, reference.chapter, locale])

  // Handle view verse button click
  const handleViewVerse = () => {
    setViewMode('verse')
    setVerseLoading(true)
    setVerseError(null)

    const verseKey = createVerseKey(reference.chapter, reference.start_verse, reference.end_verse)

    fetch(`/api/quran/verses/by_key/${verseKey}?language=${locale}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((response) => {
        setVerses(response.verses)
      })
      .catch((err) => {
        console.error('Failed to fetch verses:', err)
        setVerseError(tVerse('error', 'Failed to load verse'))
      })
      .finally(() => {
        setVerseLoading(false)
      })
  }

  // Handle back to chapter
  const handleBackToChapter = () => {
    setViewMode('chapter')
  }

  // Reset view mode when popover closes
  React.useEffect(() => {
    if (!open) {
      setViewMode('chapter')
    }
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-opacity hover:opacity-80 ${colorClasses[variant]}`}
        >
          {formatQuranRef(reference.chapter, reference.start_verse, reference.end_verse)}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        {viewMode === 'chapter' ? (
          <>
            {chapterLoading && (
              <div className="flex items-center justify-center py-6">
                <div className="text-sm text-muted-foreground">{tChapter('loading', 'Loading...')}</div>
              </div>
            )}

            {chapterError && (
              <div className="flex items-center justify-center py-6">
                <div className="text-sm text-destructive">{chapterError}</div>
              </div>
            )}

            {chapter && !chapterLoading && !chapterError && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="text-xl font-bold">{chapter.name_arabic}</h4>
                  <p className="text-sm font-medium">{chapter.name_simple}</p>
                  <p className="text-sm text-muted-foreground">
                    {chapter.translated_name.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
                  <div>
                    <span className="font-medium">{tChapter('chapter', 'Chapter')}:</span>
                    <span className="ml-2 text-muted-foreground">{chapter.id}</span>
                  </div>
                  <div>
                    <span className="font-medium">{tChapter('verses', 'Verses')}:</span>
                    <span className="ml-2 text-muted-foreground">{chapter.verses_count}</span>
                  </div>
                  <div>
                    <span className="font-medium">{tChapter('revelation', 'Revelation')}:</span>
                    <span className="ml-2 text-muted-foreground capitalize">
                      {chapter.revelation_place}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">{tChapter('order', 'Order')}:</span>
                    <span className="ml-2 text-muted-foreground">{chapter.revelation_order}</span>
                  </div>
                </div>

                {chapter.pages && chapter.pages.length > 0 && (
                  <div className="pt-2 text-sm">
                    <span className="font-medium">{tChapter('pages', 'Pages')}:</span>
                    <span className="ml-2 text-muted-foreground">
                      {chapter.pages[0]} - {chapter.pages[chapter.pages.length - 1]}
                    </span>
                  </div>
                )}

                {chapter.bismillah_pre && (
                  <div className="rounded-md bg-muted px-3 py-2 text-center text-sm">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </div>
                )}

                {/* View Verse Button */}
                <div className="border-t pt-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleViewVerse}
                  >
                    {tVerse('viewVerse', 'View Verse')} →
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3">
            {/* Back Button */}
            <div className="border-b pb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToChapter}
              >
                ← {tVerse('backToChapter', 'Back to Chapter')}
              </Button>
            </div>

            {/* Verse Display */}
            <VerseDisplay
              verses={verses}
              loading={verseLoading}
              error={verseError}
              dictionary={{
                showTranslation: tVerse('showTranslation', 'Show Translation'),
                hideTranslation: tVerse('hideTranslation', 'Hide Translation'),
                loading: tVerse('loading', 'Loading verse...'),
                error: tVerse('error', 'Failed to load verse'),
                verseNumber: tVerse('verseNumber', 'Verse'),
              }}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

