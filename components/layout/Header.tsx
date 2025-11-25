'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Search } from 'lucide-react';
import { useTranslations, useLocale } from '@/components/i18n/I18nProvider';
import LanguageDropdown from '@/components/layout/LanguageDropdown';
import ThemeToggle from '@/components/layout/ThemeToggle';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

export default function Header() {
  const t = useTranslations('header');
  const locale = useLocale();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    const searchParams = new URLSearchParams({ q: trimmedQuery });
    router.push(`/${locale}/search-result?${searchParams.toString()}`);
  };

  return (
    <header className="border-b border-gray-200 px-3 py-3 dark:border-gray-700 sm:px-4 sm:py-4 md:px-6">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Mobile: Logo and selectors on same line */}
        {/* Desktop: Logo only */}
        <div className="flex items-center justify-between gap-3 sm:justify-start">
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/logo.svg"
              alt="App Logo"
              width={0}
              height={0}
              style={{
                height: "19px",
                width: "auto",
              }}
              priority
            />
          </Link>
          {/* Mobile only: Language and theme selectors */}
          <div className="flex items-center gap-1.5 sm:hidden">
            <LanguageDropdown />
            <ThemeToggle />
          </div>
        </div>
        {/* Mobile: Search below */}
        {/* Desktop: Search and selectors grouped on the right */}
        <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
          <form
            className="w-full sm:w-auto sm:min-w-80 sm:max-w-xl lg:max-w-2xl"
            onSubmit={handleSearch}
            role="search"
            aria-label={t('searchPlaceholder')}
          >
            <InputGroup>
              <InputGroupInput
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchPlaceholder')}
                className="py-2"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <InputGroupAddon>
                <Search aria-hidden="true" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  variant="secondary"
                  className="cursor-pointer"
                  type="submit"
                >
                  {t('searchButton')}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </form>
          {/* Desktop only: Language and theme selectors */}
          <div className="hidden items-center gap-1.5 sm:flex sm:gap-2 md:gap-3">
            <LanguageDropdown />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
