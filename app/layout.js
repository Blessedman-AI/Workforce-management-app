import './globals.css';
import { Roboto, Merriweather } from 'next/font/google';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Toaster } from 'react-hot-toast';
import SessionWrapper from '@/helpers/SessionWrapper';
import SessionMonitor from '@/helpers/sessionGuard';
import ErrorBoundary from '@/components/ErrorBoundary';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-merriweather',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-roboto',
});

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions); // Fetch session
  // console.log('Server-side Session:', session);
  return (
    <html lang="en">
      <body
      // className={`${roboto.variable} ${merriweather.variable} font-sans, antialiased`}
      // className={`${roboto.variable}  font-sans, antialiased`}
      >
        <ErrorBoundary>
          <SessionWrapper session={session}>
            {children}
            <Toaster position="top-center" />
          </SessionWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
