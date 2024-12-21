import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = {
  title: 'משרד רואי חשבון זועבי',
  description: 'פתרונות חשבונאות מקצועיים לעסקים ויחידים',
  manifest: '/site.webmanifest',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://nader-zoabi.vercel.app'
  ),
  keywords: [
    'חשבונאות',
    'החזר מס',
    'שירותים פיננסיים',
    'ניהול עסק',
    'זועבי',
  ],
  authors: [{ name: 'Shhady Serhan' }],
  creator: 'Shhady Serhan',
  openGraph: {
    title: 'משרד רואי חשבון זועבי',
    description: 'פתרונות חשבונאות מקצועיים לעסקים ויחידים',
    url: '/',
    siteName: 'משרד רואי חשבון זועבי',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'תמונת כיסוי של המשרד',
      },
    ],
    locale: 'he_IL',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="he" dir="rtl">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
          <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </head>
        <body>
          <Navbar />
          <div className='mt-16'>
            {children}
          </div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
} 