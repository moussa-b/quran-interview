'use client'

import * as React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { VerseDisplay } from './VerseDisplay'
import { useTranslations, useLocale } from '@/components/i18n/I18nProvider'
import type { ItemQuranRef } from '@/lib/api/services/types'
import type { Chapter, Verse } from '@/lib/api/clients/quran'
import { CirclePause, CirclePlay, Loader2 } from 'lucide-react'
import { Slider } from '@/components/ui/slider'

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

function formatTimeLabel(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00'
  }
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
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
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null)
  const [audioLoading, setAudioLoading] = React.useState(false)
  const [audioError, setAudioError] = React.useState<string | null>(null)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)

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
    fetchAudioMetadata()

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

  const fetchAudioMetadata = () => {
    setAudioLoading(true)
    setAudioError(null)
    setAudioUrl(null)
    const params = new URLSearchParams({
      chapter: reference.chapter.toString(),
      verse: reference.start_verse.toString(),
    })

    fetch(`/api/quran/audio?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then((response) => {
        if (response?.audio?.url) {
          setAudioUrl(response.audio.url)
        } else {
          setAudioError(tVerse('audioUnavailable', 'Audio unavailable for this verse'))
        }
      })
      .catch((err) => {
        console.error('Failed to fetch verse audio:', err)
        setAudioError(tVerse('audioError', 'Failed to load verse audio'))
      })
      .finally(() => {
        setAudioLoading(false)
        setCurrentTime(0)
        setDuration(0)
      })
  }

  const handleToggleAudio = () => {
    if (audioLoading || !audioRef.current || !audioUrl) {
      return
    }

    const audioEl = audioRef.current
    if (isPlaying) {
      audioEl.pause()
    } else {
      audioEl
        .play()
        .catch((error) => {
          console.error('Failed to play audio:', error)
          setAudioError(tVerse('audioError', 'Failed to play audio'))
        })
    }
  }

  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current || !duration) {
      return
    }
    const [nextTime] = value
    audioRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }

  // Reset view mode when popover closes
  React.useEffect(() => {
    if (!open) {
      setViewMode('chapter')
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [open])

  React.useEffect(() => {
    const audioEl = new Audio()
    audioRef.current = audioEl

    const handleTimeUpdate = () => {
      setCurrentTime(audioEl.currentTime)
    }
    const handleLoadedMetadata = () => {
      setDuration(audioEl.duration || 0)
    }
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audioEl.addEventListener('timeupdate', handleTimeUpdate)
    audioEl.addEventListener('loadedmetadata', handleLoadedMetadata)
    audioEl.addEventListener('play', handlePlay)
    audioEl.addEventListener('pause', handlePause)
    audioEl.addEventListener('ended', handleEnded)

    return () => {
      audioEl.pause()
      audioEl.src = ''
      audioEl.removeEventListener('timeupdate', handleTimeUpdate)
      audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audioEl.removeEventListener('play', handlePlay)
      audioEl.removeEventListener('pause', handlePause)
      audioEl.removeEventListener('ended', handleEnded)
    }
  }, [])

  React.useEffect(() => {
    const audioEl = audioRef.current
    if (!audioEl) {
      return
    }

    if (!audioUrl) {
      audioEl.pause()
      audioEl.removeAttribute('src')
      setIsPlaying(false)
      setCurrentTime(0)
      setDuration(0)
      return
    }

    audioEl.src = audioUrl
    audioEl.load()
  }, [audioUrl])

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

            <div className="space-y-2 rounded-md border bg-muted/30 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{tVerse('audio', 'Audio')}</span>
                {audioError && <span className="text-xs text-destructive">{audioError}</span>}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleToggleAudio}
                  disabled={audioLoading || !audioUrl}
                  aria-label={isPlaying ? tVerse('pause', 'Pause audio') : tVerse('play', 'Play audio')}
                >
                  {audioLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isPlaying ? (
                    <CirclePause className="h-4 w-4" />
                  ) : (
                    <CirclePlay className="h-4 w-4" />
                  )}
                </Button>
                <div className="flex w-full flex-col gap-1">
                  <Slider
                    max={duration || 1}
                    step={0.1}
                    value={[Math.min(currentTime, duration || 1)]}
                    onValueChange={handleSliderChange}
                    disabled={!audioUrl || audioLoading || !duration}
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatTimeLabel(currentTime)}</span>
                    <span>{formatTimeLabel(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

