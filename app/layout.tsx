import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Figtree } from 'next/font/google';
import './globals.css';
import { fallbackLocale } from '@/lib/i18n/config';

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
      <body className={`${figtree.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
