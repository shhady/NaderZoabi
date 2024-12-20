import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';
import {
    ClerkProvider,
  } from '@clerk/nextjs'
export const metadata = {
  title: 'משרד רואי חשבון זועבי',
  description: 'פתרונות חשבונאות מקצועיים לעסקים ויחידים',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="he" dir="rtl">
        <body>
          <Navbar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
} 