import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import { I18nProvider } from '@/components/i18n/I18nProvider';
import {
  getDictionary,
  isLocale,
  locales,
} from '@/lib/i18n/config';

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam;
  const dictionary = await getDictionary(locale);

  return (
    <I18nProvider locale={locale} messages={dictionary}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </I18nProvider>
  );
}

