import type { Metadata } from 'next';
import { Inter, Source_Serif_4, Playfair_Display } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'The Law Diaries',
    template: '%s · The Law Diaries',
  },
  description: 'Long-form commentary on law, policy, and current affairs.',
  metadataBase: new URL(
    (() => {
      const raw = process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
      return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    })()
  ),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'The Law Diaries',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable} ${playfair.variable}`}>
      <body className="flex flex-col min-h-screen bg-canvas text-ink">
        <SessionProviderWrapper>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
