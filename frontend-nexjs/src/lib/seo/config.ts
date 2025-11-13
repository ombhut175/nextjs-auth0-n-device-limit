/**
 * SEO Configuration
 * Central configuration for site-wide SEO metadata
 */

export const siteConfig = {
  name: 'NGuard',
  title: 'NGuard - Secure Device Session Management',
  description: 'Secure authentication platform with device-limited session management. Control and monitor your active devices with Auth0 integration.',
  url: process.env.APP_BASE_URL || 'http://localhost:3623',
  ogImage: '/og-image.png',
  twitterHandle: '@nguard',
  twitterCreator: '@nguard',
  keywords: [
    'authentication',
    'device management',
    'session management',
    'Auth0',
    'security',
    'multi-device',
    'access control',
    'Next.js',
  ] as string[],
  author: {
    name: 'NGuard Team',
    url: process.env.APP_BASE_URL || 'http://localhost:3623',
  },
  organization: {
    name: 'NGuard',
    url: process.env.APP_BASE_URL || 'http://localhost:3623',
    logo: '/logo.png',
    description: 'Secure device session management platform',
  },
};

import type { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.organization.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitterCreator,
    site: siteConfig.twitterHandle,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};
