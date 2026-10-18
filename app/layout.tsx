import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://mangaverse.dpdns.org"),

  title: {
    default: "MangaVerse — Read Manga Online Free",
    template: "%s | MangaVerse",
  },

  applicationName: "MangaVerse",

  description:
    "Read manga online free on MangaVerse. Browse thousands of manga series.",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    url: "https://mangaverse.dpdns.org/",
    siteName: "MangaVerse",
    title: "MangaVerse — Read Manga Online Free",
    description:
      "Read manga online free on MangaVerse. Browse thousands of manga series.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MangaVerse",
    alternateName: "MangaVerse",
    url: "https://mangaverse.dpdns.org/",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <Providers>{children}</Providers>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FYSE2JTB8Q"
          strategy="afterInteractive"
        />

        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FYSE2JTB8Q');
          `}
        </Script>
      </body>
    </html>
  );
}