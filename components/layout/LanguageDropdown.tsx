'use client';

import { useCallback } from 'react';
import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Locale, localeDisplayNames, locales } from '@/lib/i18n/config';
import { useLocale, useTranslations } from '@/components/i18n/I18nProvider';

function buildLocalizedPath(pathname: string, locale: Locale) {
  const segments = pathname.split('/').filter(Boolean);
  const [, ...rest] = segments;
  const localizedSuffix = rest.length > 0 ? `/${rest.join('/')}` : '';
  return `/${locale}${localizedSuffix}`;
}

export default function LanguageDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const activeLocale = useLocale();
  const t = useTranslations('header');

  const handleSelect = useCallback(
    (nextLocale: Locale) => {
      if (!pathname || nextLocale === activeLocale) {
        return;
      }
      const nextPath = buildLocalizedPath(pathname, nextLocale);
      router.push(nextPath);
      router.refresh();
    },
    [activeLocale, pathname, router]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label={t('languageLabel')}
      >
        <Globe className="h-5 w-5 text-gray-700 dark:text-gray-200"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
          {t('languageLabel')}
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={activeLocale}
          onValueChange={(value) => handleSelect(value as Locale)}
        >
          {locales.map((locale) => (
            <DropdownMenuRadioItem key={locale}
                                   value={locale}>
              {localeDisplayNames[locale]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
