import type { Metadata } from 'next';
import { Geist, Fraunces } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const fraunces = Fraunces({
  variable: '--font-logo',
  subsets: ['latin'],
  weight: '600',
  style: ['italic'],
});

export const metadata: Metadata = {
  title: "Shyam's Shelf",
  description: 'Track your books, movies, and shows',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
