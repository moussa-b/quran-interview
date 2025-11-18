import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { fallbackLocale, isLocale, type Locale, } from '@/lib/i18n/config';

const LOCALE_COOKIE = 'NEXT_LOCALE';

function shouldBypass(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    // Bypass static files (images, fonts, etc.)
    /\.(svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|otf|css|js|json)$/i.test(pathname)
  );
}

function extractLocaleFromPath(pathname: string): {
  locale: Locale | null;
  restPath: string;
  isInvalidLocale: boolean;
} {
  const segments = pathname.split('/').filter(Boolean);
  const [possibleLocale, ...rest] = segments;
  
  if (possibleLocale && isLocale(possibleLocale)) {
    return {
      locale: possibleLocale,
      restPath: `/${rest.join('/')}`.replace(/\/$/, '') || '/',
      isInvalidLocale: false,
    };
  }

  // Check if it looks like a locale code (2-3 letter code) but isn't valid
  const isInvalidLocale = possibleLocale ? /^[a-z]{2,3}$/i.test(possibleLocale) : false;

  return {
    locale: null, 
    restPath: pathname || '/',
    isInvalidLocale,
  };
}

function detectPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;

  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get('accept-language');

  if (acceptLanguage) {
    for (const part of acceptLanguage.split(',')) {
      const localeCandidate = part.split(';')[0]?.trim().split('-')[0];
      if (localeCandidate && isLocale(localeCandidate)) {
        return localeCandidate;
      }
    }
  }

  return fallbackLocale;
}

export function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  const {locale, isInvalidLocale} = extractLocaleFromPath(pathname);

  if (locale) {
    const response = NextResponse.next();

    if (request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
      response.cookies.set(LOCALE_COOKIE, locale, {
        path: '/',
        sameSite: 'lax',
      });
    }

    return response;
  }

  const detectedLocale = detectPreferredLocale(request);
  const url = request.nextUrl.clone();
  
  // If invalid locale detected (e.g., /es when only en/fr supported), redirect to fallback locale root
  if (isInvalidLocale) {
    url.pathname = `/${detectedLocale}`;
  } else {
    url.pathname = `/${detectedLocale}${pathname}`.replace(/\/{2,}/g, '/');
  }

  const response = NextResponse.redirect(url, 307);
  response.cookies.set(LOCALE_COOKIE, detectedLocale, {
    path: '/',
    sameSite: 'lax',
  });

  return response;
}
