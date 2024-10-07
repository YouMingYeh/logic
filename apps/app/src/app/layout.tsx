import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import 'ui/styles/globals.css';
import React from 'react';
import { Toaster } from 'ui';
import { Analytics } from '@vercel/analytics/react';
import Providers from './providers';

const inter = Merriweather({ weight: ['400', '700'], subsets: ['latin'] });

// TODO: update the site metadata
export const metadata: Metadata = {
  title: 'logic | learn to persuade people',
  description:
    "logic is a chatbot that helps you learn to persuade people. We believe that logos in Aristotle's rhetorical triangle is the key to persuasion.",
  keywords: [
    'logic',
    'chatbot',
    'persuasion',
    'logos',
    'aristotle',
    'rhetorical triangle',
  ],
  metadataBase: new URL('https://logic.vercel.app'),
  openGraph: {
    title: 'logic | learn to persuade people',
    description:
      'logic is a chatbot that helps you learn to persuade people. We believe that logos in Aristotle\'s rhetorical triangle is the key to persuasion.',
    type: 'website',
    url: 'https://logic.vercel.app',
    siteName: 'logic',
    images: [
      {
        url: 'https://logic.vercel.app/icon512_rounded.png',
        width: 1200,
        height: 630,
        alt: 'logic',
      },
    ],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  applicationName: 'logic',
  appleWebApp: true,
};

// TODO: Add global providers over here
const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en' suppressHydrationWarning>
    {/* <Head> */}
      {/* <link href='/manifest.json' rel='manifest' /> */}
    {/* </Head> */}

    <body className={inter.className}>
      <Providers>{children}</Providers>
      <Toaster />
      {/* <Pwa /> */}
      <Analytics />
    </body>
  </html>
);

export default RootLayout;
