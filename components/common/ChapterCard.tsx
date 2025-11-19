'use client'

import * as React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'
import { Chapter } from '@/lib/api';

interface ChapterCardProps {
  chapter: Chapter
  className?: string
  children?: React.ReactNode
}

export function ChapterCard({chapter, className, children}: ChapterCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children || (
          <div
            className={cn(
              'cursor-pointer rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground',
              className
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{chapter.name_simple}</h3>
                <p className="text-sm text-muted-foreground">
                  {chapter.translated_name.name}
                </p>
              </div>
              <div className="text-2xl font-bold text-primary">{chapter.name_arabic}</div>
            </div>
          </div>
        )}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
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
      </HoverCardContent>
    </HoverCard>
  )
}

