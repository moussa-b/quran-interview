import { notFound } from 'next/navigation';
import { getDictionary, isLocale } from '@/lib/i18n/config';

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const dictionary = await getDictionary(localeParam);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-6 rounded-3xl bg-white p-10 text-center shadow-lg dark:bg-zinc-950 dark:text-zinc-100 sm:text-left">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
          {dictionary.app.title}
        </p>
        <h1 className="text-4xl font-semibold text-zinc-900 dark:text-white">
          {dictionary.home.heroTitle}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300">
          {dictionary.home.heroDescription}
        </p>
      </main>
    </div>
  );
}
