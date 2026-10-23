import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Script from "next/script";

const SITE_URL = "https://mangaverse.dpdns.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "MangaVerse — Read Manga Online Free",
    template: "%s | MangaVerse",
  },

  applicationName: "MangaVerse",

  description:
    "Discover and read manga online on MangaVerse. Explore manga series, discover new stories, and find your next favorite manga.",

  keywords: [
    "MangaVerse",
    "Manga Verse",
    "read manga online",
    "manga series",
    "online manga",
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  icons: {
    icon: "/favicon.ico",
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "MangaVerse",
    title: "MangaVerse — Read Manga Online Free",
    description:
      "Discover and read manga online on MangaVerse. Explore manga series and find your next favorite story.",
    locale: "en_US",
  },

  twitter: {
    card: "summary",
    title: "MangaVerse — Read Manga Online Free",
    description:
      "Discover and read manga online on MangaVerse.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "MangaVerse",
    alternateName: "Manga Verse",
    url: `${SITE_URL}/`,
  };

  return (<html lang="en" suppressHydrationWarning> <body>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteSchema).replace(/</g, "\u003c"),
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