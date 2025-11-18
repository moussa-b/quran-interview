'use client';

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';
import type { Locale, Messages } from '@/lib/i18n/config';

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

type I18nProviderProps = {
  locale: Locale;
  messages: Messages;
  children: ReactNode;
};

function resolveMessage(messages: Messages, key: string): unknown {
  return key.split('.').reduce<unknown>((value, segment) => {
    if (
      typeof value !== 'object' ||
      value === null ||
      !(segment in value)
    ) {
      return undefined;
    }
    return (value as Record<string, unknown>)[segment];
  }, messages);
}

export function I18nProvider({ locale, messages, children }: I18nProviderProps) {
  const contextValue = useMemo(
    () => ({ locale, messages }),
    [locale, messages]
  );

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslations(namespace?: string) {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useTranslations must be used within an I18nProvider');
  }

  return (key: string, fallback?: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const message = resolveMessage(context.messages, fullKey);

    if (typeof message === 'string') {
      return message;
    }

    return fallback ?? fullKey;
  };
}

export function useLocale() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useLocale must be used within an I18nProvider');
  }

  return context.locale;
}

