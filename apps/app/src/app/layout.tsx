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
  title: 'Logic | Think better',
  description:
    "Logic is an AI-driven assistant designed to elevate the thinking of top executives, entrepreneurs, and decision-makers. Through expert techniques, case studies, and innovative problem-solving frameworks, Logic helps you approach challenges with clarity and make smarter decisions.",
  keywords: [
    'Logic',
    'chatbot',
    'persuasion',
    'logos',
    'aristotle',
    'rhetorical triangle',
  ],
  metadataBase: new URL('https://logic-mauve.vercel.app'),
  openGraph: {
    title: 'Logic | Think better',
    description:
      "Logic is an AI-driven assistant designed to elevate the thinking of top executives, entrepreneurs, and decision-makers. Through expert techniques, case studies, and innovative problem-solving frameworks, Logic helps you approach challenges with clarity and make smarter decisions.",
    type: 'website',
    url: 'https://logic-mauve.vercel.app',
    siteName: 'Logic',
    images: [
      {
        url: 'https://logic-mauve.vercel.app/icon512_rounded.png',
        width: 1200,
        height: 630,
        alt: 'Logic',
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
