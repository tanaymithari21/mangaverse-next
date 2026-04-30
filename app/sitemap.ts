import { MetadataRoute } from "next";

const BASE_URL = "https://mangaverse.dpdns.org";

const GENRES = [
  "Action", "Adventure", "Romance", "Fantasy", "Isekai",
  "Shounen", "Seinen", "Slice of Life", "Horror", "Comedy",
  "Mystery", "Supernatural", "Martial Arts", "Mecha", "Sports",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/home`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/genres-guide`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/how-to-read`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const genrePages: MetadataRoute.Sitemap = GENRES.map((genre) => ({
    url: `${BASE_URL}/home?genre=${encodeURIComponent(genre)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...genrePages];
}
