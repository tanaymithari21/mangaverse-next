import type { Metadata } from "next";
import MangaDetailClient from "./MangaDetailClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_BASE_URL}/api/manga/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { title: "Manga — MangaVerse" };
    const manga = await res.json();
    return {
      title: `${manga.title} — Read Online Free | MangaVerse`,
      description: manga.description?.slice(0, 155) || `Read ${manga.title} manga online free on MangaVerse.`,
      openGraph: {
        title: manga.title,
        description: manga.description?.slice(0, 155),
        images: manga.cover ? [{ url: manga.cover }] : [],
      },
    };
  } catch {
    return { title: "Manga — MangaVerse" };
  }
}

export default async function MangaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MangaDetailClient id={id} />;
}
