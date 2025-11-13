import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Only include public pages in sitemap
  // Private/authenticated pages should not be indexed
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
