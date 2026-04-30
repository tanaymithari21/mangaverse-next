import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/upload-manga", "/upload-chapter", "/edit-manga", "/genres"],
      },
    ],
    sitemap: "https://mangaverse.dpdns.org/sitemap.xml",
    host: "https://mangaverse.dpdns.org",
  };
}
