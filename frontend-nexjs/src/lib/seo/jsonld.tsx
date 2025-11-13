/**
 * JSON-LD Schema Generators
 * Functions to generate structured data for search engines
 */

import { siteConfig } from './config';

interface Thing {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

export function generateOrganizationSchema(): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.organization.name,
    url: siteConfig.organization.url,
    logo: `${siteConfig.url}${siteConfig.organization.logo}`,
    description: siteConfig.organization.description,
    sameAs: [
      // Add social media links here when available
    ],
  };
}

export function generateWebSiteSchema(): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.organization.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}${siteConfig.organization.logo}`,
      },
    },
  };
}

export function generateWebPageSchema(props: {
  title: string;
  description: string;
  url: string;
}): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: props.title,
    description: props.description,
    url: props.url,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function generateWebApplicationSchema(): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: siteConfig.organization.name,
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * Component to render JSON-LD script tag
 * Includes XSS protection by escaping < characters
 */
export function JsonLd({ data }: { data: Thing | Thing[] }) {
  const jsonString = JSON.stringify(Array.isArray(data) ? data : data);
  const safeJsonString = jsonString.replace(/</g, '\\u003c');
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: safeJsonString,
      }}
    />
  );
}
