import type en from '@/locales/en/common.json';

export const locales = ["en", "fr"] as const;

export type Locale = (typeof locales)[number];

export type Messages = typeof en;

export const fallbackLocale: Locale = "en";

export const localeDisplayNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

const dictionaries: Record<Locale, () => Promise<Messages>> = {
  en: () => import('@/locales/en/common.json').then((module) => module.default),
  fr: () => import('@/locales/fr/common.json').then((module) => module.default),
};

export async function getDictionary(locale: Locale): Promise<Messages> {
  const loadDictionary = dictionaries[locale] ?? dictionaries[fallbackLocale];
  return loadDictionary();
}

export function isLocale(maybeLocale: string): maybeLocale is Locale {
  return locales.includes(maybeLocale as Locale);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (value && isLocale(value)) {
    return value;
  }
  return fallbackLocale;
}

