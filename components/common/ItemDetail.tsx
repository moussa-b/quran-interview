'use client';

import type { ItemQuranRef } from '@/lib/api/services/types';
import { QuranReferenceBadge } from './QuranReferenceBadge';

type ItemDetailProps = {
  title?: string | null;
  fallbackSlug?: string;
  description?: string | null;
  references?: ItemQuranRef[];
  badgeVariant?: 'blue' | 'green';
  titleClassName?: string;
};

export function ItemDetail({
  title,
  fallbackSlug,
  description,
  references,
  badgeVariant = 'green',
  titleClassName,
}: ItemDetailProps) {
  const displayTitle = title || fallbackSlug || '';
  const hasReferences = Boolean(references && references.length > 0);

  return (
    <div>
      <div
        className={`font-medium text-zinc-900 dark:text-white text-sm ${titleClassName ?? ''}`}
      >
        {displayTitle}
      </div>
      {description && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          {description}
        </p>
      )}
      {hasReferences && (
        <div className="flex flex-wrap gap-2 mt-2">
          {references!.map((ref) => (
            <QuranReferenceBadge
              key={ref.id}
              reference={ref}
              variant={badgeVariant}
            />
          ))}
        </div>
      )}
    </div>
  );
}
