/**
 * Metadata Helper Functions
 * Utilities for generating page-specific metadata
 */

import type { Metadata } from 'next';
import { siteConfig } from './config';

interface PageMetadataProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}

export function generatePageMetadata({
  title,
  description,
  path,
  keywords = [],
  ogImage,
  noIndex = false,
}: PageMetadataProps): Metadata {
  const url = `${siteConfig.url}${path}`;
  const imageUrl = ogImage
    ? `${siteConfig.url}${ogImage}`
    : `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: siteConfig.twitterCreator,
      site: siteConfig.twitterHandle,
      images: [imageUrl],
    },
  };
}
