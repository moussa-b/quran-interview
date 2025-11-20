'use client'

import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { Chapter } from '@/lib/api/clients/quran'

interface ChapterCardProps {
  chapterNumber: number
  children: React.ReactNode
}

export function ChapterCard({ chapterNumber, children }: ChapterCardProps) {
  const [chapter, setChapter] = React.useState<Chapter | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (open && !chapter) {
      setLoading(true)
      setError(null)
      
      // Call our Next.js API route instead of the Quran API directly
      fetch(`/api/quran/chapters/${chapterNumber}`)
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
          setError('Failed to load chapter information')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [open, chapter, chapterNumber])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {loading && (
          <div className="flex items-center justify-center py-6">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center py-6">
            <div className="text-sm text-destructive">{error}</div>
          </div>
        )}
        
        {chapter && !loading && !error && (
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
                <span className="font-medium">Chapter:</span>
                <span className="ml-2 text-muted-foreground">{chapter.id}</span>
              </div>
              <div>
                <span className="font-medium">Verses:</span>
                <span className="ml-2 text-muted-foreground">{chapter.verses_count}</span>
              </div>
              <div>
                <span className="font-medium">Revelation:</span>
                <span className="ml-2 text-muted-foreground capitalize">
                  {chapter.revelation_place}
                </span>
              </div>
              <div>
                <span className="font-medium">Order:</span>
                <span className="ml-2 text-muted-foreground">{chapter.revelation_order}</span>
              </div>
            </div>

            {chapter.pages && chapter.pages.length > 0 && (
              <div className="pt-2 text-sm">
                <span className="font-medium">Pages:</span>
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
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

