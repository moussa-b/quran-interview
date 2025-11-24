import { notFound } from 'next/navigation';
import { getDictionary, isLocale } from '@/lib/i18n/config';
import { searchTopics } from '@/lib/api/services/topics';
import type { ItemWithDetails } from '@/lib/api/services/types';
import { Item, ItemContent, ItemGroup } from '@/components/ui/item';
import { ItemDetail } from '@/components/common/ItemDetail';
import { SearchBackButton } from '@/components/common/SearchBackButton';

type SearchResultPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ q?: string | string[] }>;
};

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

  let results: ItemWithDetails[] = [];
  if (normalizedQuery) {
    results = await searchTopics(normalizedQuery, localeParam);
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

                return (
                  <Item key={item.id} variant="outline">
                    <ItemContent>
                      <ItemDetail
                        title={translation?.label}
                        fallbackSlug={item.slug}
                        description={translation?.description}
                        references={item.quran_refs}
                      />
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
