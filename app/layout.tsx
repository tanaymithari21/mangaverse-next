import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "MangaVerse — Read Manga Online Free",
  description: "Read manga online free on MangaVerse. Browse thousands of manga series.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
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
