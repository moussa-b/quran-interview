'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import type { Verse } from '@/lib/api/clients/quran'

interface VerseDisplayProps {
  verses: Verse[]
  loading: boolean
  error: string | null
  dictionary: {
    showTranslation: string
    hideTranslation: string
    loading: string
    error: string
    verseNumber: string
  }
}

export function VerseDisplay({
  verses,
  loading,
  error,
  dictionary,
}: VerseDisplayProps) {
  const [showTranslation, setShowTranslation] = React.useState(true)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="text-sm text-muted-foreground">{dictionary.loading}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="text-sm text-destructive">{error}</div>
      </div>
    )
  }

  if (!verses || verses.length === 0) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="text-sm text-muted-foreground">{dictionary.error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Translation Toggle Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowTranslation(!showTranslation)}
        >
          {showTranslation ? dictionary.hideTranslation : dictionary.showTranslation}
        </Button>
      </div>

      {/* Verses Display */}
      <div className="space-y-4">
        {verses.map((verse) => (
          <div
            key={verse.id}
            className="space-y-2 rounded-md border bg-muted/30 p-3"
          >
            {/* Verse Number Label */}
            {verses.length > 1 && (
              <div className="text-xs font-medium text-muted-foreground">
                {dictionary.verseNumber} {verse.verse_number}
              </div>
            )}

            {/* Arabic Text */}
            {verse.text_uthmani && (
              <div
                className="text-right text-lg leading-loose text-foreground"
                dir="rtl"
                lang="ar"
              >
                {verse.text_uthmani}
              </div>
            )}

            {/* Translation */}
            {showTranslation && verse.translations && verse.translations.length > 0 ? (
              <div className="space-y-2 border-t pt-2 mt-3">
                {verse.translations.map((translation, index) => (
                  <div
                    key={translation.id || index}
                    className="text-sm text-muted-foreground italic"
                    dangerouslySetInnerHTML={{ __html: translation.text }}
                  />
                ))}
              </div>
            ) : showTranslation && (!verse.translations || verse.translations.length === 0) ? (
              <div className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                No translation available
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

