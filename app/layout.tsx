import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Figtree } from 'next/font/google';
import './globals.css';
import { fallbackLocale } from '@/lib/i18n/config';
import Script from 'next/script';

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quran themes index",
  description: "Index of key concepts and main themes of the Quran",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeFromCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const lang = localeFromCookie ?? fallbackLocale;

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <Script defer src="https://umami.bdzapps.com/script.js" data-website-id="3d276b12-7126-465d-965f-323418e28c46"></Script>
      </head>
      <body className={`${figtree.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
