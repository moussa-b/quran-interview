import { notFound } from 'next/navigation';
import { getDictionary, isLocale } from '@/lib/i18n/config';
import { searchItems } from '@/lib/api/services/items';
import type { ItemSearchResultWithDetails } from '@/lib/api/services/types';
import { Item, ItemContent, ItemGroup } from '@/components/ui/item';
import { ItemDetail } from '@/components/common/ItemDetail';
import { SearchBackButton } from '@/components/common/SearchBackButton';

type SearchResultPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ q?: string | string[] }>;
};

function pickTranslationLabel<T extends { language_code: string; label: string | null }>(
  translations: T[] | undefined,
  locale: string
): string | null {
  if (!translations || translations.length === 0) {
    return null;
  }

  const match =
    translations.find((translation) => translation.language_code === locale) ?? translations[0];
  return match?.label ?? null;
}

function resolveQueryParam(param?: string | string[]): string {
  if (Array.isArray(param)) {
    return param[0] ?? '';
  }
  return param ?? '';
}

export default async function SearchResultPage({ params, searchParams }: SearchResultPageProps) {
  const { locale: localeParam } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  if (!isLocale(localeParam)) {
    notFound();
  }

  const dictionary = await getDictionary(localeParam);
  const rawQuery = resolveQueryParam(resolvedSearchParams.q);
  const normalizedQuery = rawQuery.trim();

  let results: ItemSearchResultWithDetails[] = [];
  if (normalizedQuery) {
    results = await searchItems(normalizedQuery, localeParam);
  }

  const hasResults = normalizedQuery.length > 0 && results.length > 0;

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
            {dictionary.app.title}
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-zinc-900 dark:text-white">
            {dictionary.search.title}
          </h1>
          {normalizedQuery && (
            <>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {dictionary.search.resultsFor}{' '}
                <span className="font-semibold text-zinc-900 dark:text-white">
                  "{normalizedQuery}"
                </span>
              </p>
              <div className="mt-3">
                <SearchBackButton label={dictionary.search.backLabel} />
              </div>
            </>
          )}
        </div>

        {!normalizedQuery && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg dark:bg-zinc-950">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              {dictionary.search.emptyTitle}
            </h2>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              {dictionary.search.emptyDescription}
            </p>
          </div>
        )}

        {normalizedQuery && !hasResults && (
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg dark:bg-zinc-950">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
              {dictionary.search.noResultsTitle}
            </h2>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              {dictionary.search.noResultsDescription}
            </p>
          </div>
        )}

        {hasResults && (
          <div className="rounded-3xl bg-white p-6 shadow-lg dark:bg-zinc-950">
            <ItemGroup className="gap-3">
              {results.map((item) => {
                const translation =
                  item.translations.find((t) => t.language_code === localeParam) ||
                  item.translations[0];

                const topicLabel = pickTranslationLabel(item.topic?.translations, localeParam);
                const categoryLabel = pickTranslationLabel(
                  item.category?.translations,
                  localeParam
                );
                const subcategoryLabel = pickTranslationLabel(
                  item.subcategory?.translations,
                  localeParam
                );

                return (
                  <Item key={item.id} variant="outline">
                    <ItemContent>
                      <ItemDetail
                        title={translation?.label}
                        fallbackSlug={item.slug}
                        description={translation?.description}
                        references={item.quran_refs}
                        titleClassName="text-base md:text-lg"
                      />
                      {(topicLabel || categoryLabel || subcategoryLabel) && (
                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                          {topicLabel && (
                            <span>
                              <span className="font-semibold text-zinc-900 dark:text-white">
                                {dictionary.topic.label}:
                              </span>{' '}
                              {topicLabel}
                            </span>
                          )}
                          {categoryLabel && (
                            <span>
                              <span className="font-semibold text-zinc-900 dark:text-white">
                                {dictionary.category.label}:
                              </span>{' '}
                              {categoryLabel}
                            </span>
                          )}
                          {subcategoryLabel && (
                            <span>
                              <span className="font-semibold text-zinc-900 dark:text-white">
                                {dictionary.subcategory.label}:
                              </span>{' '}
                              {subcategoryLabel}
                            </span>
                          )}
                        </div>
                      )}
                    </ItemContent>
                  </Item>
                );
              })}
            </ItemGroup>
          </div>
        )}
      </div>
    </div>
  );
}
