import { notFound } from 'next/navigation';
import { getDictionary, isLocale } from '@/lib/i18n/config';
import { getTopicById, getTopicBySlug } from '@/lib/api/services/topics';
import { getCategories } from '@/lib/api/services/categories';
import { getSubcategories } from '@/lib/api/services/subcategories';
import { getItems } from '@/lib/api/services/items';
import { CategoryAccordion } from '@/components/common/CategoryAccordion';
import type { TopicWithTranslations } from '@/lib/api/services/types';

type TopicPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function TopicPage({ params }: TopicPageProps) {
  const { locale: localeParam, slug: slugParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const dictionary = await getDictionary(localeParam);
  
  // Determine if the parameter is an ID (numeric) or a slug (string)
  let topic: TopicWithTranslations | null;
  const numericId = parseInt(slugParam, 10);
  
  if (!isNaN(numericId) && numericId.toString() === slugParam) {
    // Parameter is a valid integer ID
    topic = await getTopicById(numericId, localeParam);
  } else {
    // Parameter is a slug
    topic = await getTopicBySlug(slugParam, localeParam);
  }

  if (!topic) {
    notFound();
  }

  // Get the translation for the current locale
  const translation = topic.translations.find(t => t.language_code === localeParam) || topic.translations[0];

  // Fetch categories for this topic
  const categories = await getCategories(topic.id, localeParam);

  // Fetch subcategories and items for each category
  const categoriesWithSubcategoriesAndItems = await Promise.all(
    categories.map(async (category) => {
      const subcategories = await getSubcategories(category.id, localeParam);
      
      // Fetch items for each subcategory
      const subcategoriesWithItems = await Promise.all(
        subcategories.map(async (subcategory) => {
          const items = await getItems(undefined, subcategory.id, localeParam);
          return {
            ...subcategory,
            items,
          };
        })
      );
      
      // Fetch items directly under this category (not under subcategories)
      const categoryItems = await getItems(category.id, undefined, localeParam);
      
      return {
        ...category,
        subcategories: subcategoriesWithItems,
        items: categoryItems,
      };
    })
  );

  // Calculate metadata: unique chapters and total verses
  const allItems = categoriesWithSubcategoriesAndItems.flatMap(cat => [
    ...cat.items,
    ...cat.subcategories.flatMap(sub => sub.items)
  ]);
  
  const uniqueChapters = new Set<number>();
  let totalVerses = 0;
  
  allItems.forEach(item => {
    item.quran_refs.forEach(ref => {
      uniqueChapters.add(ref.chapter);
      // Count verses in the reference
      if (ref.end_verse !== null) {
        totalVerses += (ref.end_verse - ref.start_verse + 1);
      } else {
        totalVerses += 1;
      }
    });
  });
  
  const chaptersCount = uniqueChapters.size;
  const versesCount = totalVerses;

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          <a href={`/${localeParam}`} className="hover:text-zinc-900 dark:hover:text-zinc-100">
            {dictionary.app.title}
          </a>
          <span className="mx-2">/</span>
          <span className="text-zinc-900 dark:text-zinc-100">{translation?.label || topic.slug}</span>
        </nav>

        {/* Topic Header */}
        <div className="rounded-3xl bg-white p-10 shadow-lg dark:bg-zinc-950 dark:text-zinc-100">
          <h1 className="text-4xl font-semibold text-zinc-900 dark:text-white">
            {translation?.label || topic.slug}
          </h1>
          
          {translation?.description && (
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
              {translation.description}
            </p>
          )}

          {/* Topic Metadata */}
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-zinc-200 pt-6 dark:border-zinc-800 md:grid-cols-4">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-primary">{categories.length}</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{dictionary.topics.categories}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-primary">
                {categoriesWithSubcategoriesAndItems.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
              </span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{dictionary.topics.subcategories}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-primary">{chaptersCount}</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{dictionary.topics.chapters}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-primary">{versesCount}</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{dictionary.topics.verses}</span>
            </div>
          </div>
        </div>

        {/* Categories Accordion */}
        {categoriesWithSubcategoriesAndItems.length > 0 && (
          <div className="mt-8 rounded-3xl bg-white p-10 shadow-lg dark:bg-zinc-950">
            <h2 className="mb-6 text-2xl font-semibold text-zinc-900 dark:text-white">
              {dictionary.topics.categories}
            </h2>
            <CategoryAccordion 
              categories={categoriesWithSubcategoriesAndItems} 
              locale={localeParam}
              dictionary={dictionary}
            />
          </div>
        )}
      </div>
    </div>
  );
}

