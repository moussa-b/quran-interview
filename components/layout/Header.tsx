'use client';

import Image from 'next/image';
import { Search } from 'lucide-react';
import { useTranslations } from '@/components/i18n/I18nProvider';
import LanguageDropdown from '@/components/layout/LanguageDropdown';
import ThemeToggle from '@/components/layout/ThemeToggle';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';

export default function Header() {
  const t = useTranslations('header');

  return (
    <header className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
      <Image
        src="/logo.svg"
        alt="App Logo"
        width={0}
        height={0}
        style={{
          height: "19px",
          width: "auto",
          cursor: "pointer",
        }}
        priority
      />
      <div className="flex items-center gap-2">
        <InputGroup className="w-64">
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
