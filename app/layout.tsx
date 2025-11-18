import type { Metadata } from 'next';
import { Figtree } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quran themes index",
  description: "Index of key concepts and main themes of the Quran",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} antialiased`}>
      <Header />
      {children}
      </body>
    </html>
  );
}
