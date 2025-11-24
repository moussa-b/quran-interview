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
    <header className="flex items-center justify-between border-b border-gray-200 px-3 py-3 dark:border-gray-700 sm:px-4 sm:py-4 md:px-6">
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
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {/* Search bar - hidden on mobile, visible on tablet and up */}
        <form
          className="hidden w-56 md:flex lg:w-72"
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
        <LanguageDropdown />
        <ThemeToggle />
      </div>
    </header>
  );
}
