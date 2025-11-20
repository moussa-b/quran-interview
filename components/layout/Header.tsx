'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useTranslations, useLocale } from '@/components/i18n/I18nProvider';
import LanguageDropdown from '@/components/layout/LanguageDropdown';
import ThemeToggle from '@/components/layout/ThemeToggle';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

export default function Header() {
  const t = useTranslations('header');
  const locale = useLocale();

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
        <InputGroup className="hidden w-48 md:flex lg:w-64">
          <InputGroupInput
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchPlaceholder')}
          />
          <InputGroupAddon>
            <Search aria-hidden="true" />
          </InputGroupAddon>
        </InputGroup>
        <LanguageDropdown />
        <ThemeToggle />
      </div>
    </header>
  );
}
