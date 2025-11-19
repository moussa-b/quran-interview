import { notFound } from 'next/navigation';
import { getDictionary, isLocale } from '@/lib/i18n/config';
import { getTopics } from '@/lib/api/services/topics';
import { TopicCard } from '@/components/common/TopicCard';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const dictionary = await getDictionary(localeParam);
  
  // Fetch topics from the API
  const topics = await getTopics(localeParam);

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
            {dictionary.app.title}
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-zinc-900 dark:text-white">
            {dictionary.home.heroTitle}
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
            {dictionary.home.heroDescription}
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              locale={localeParam}
              translations={dictionary.topics}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
