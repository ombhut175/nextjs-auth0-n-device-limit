import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { defaultMetadata } from "@/lib/seo/config";
import { JsonLd, generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo/jsonld";

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="en">
      <body>
        <JsonLd data={[organizationSchema, websiteSchema]} />
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}
