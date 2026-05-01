

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, BookOpen, ArrowLeft, Clock, User, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import ImageReader from "@/components/ImageReader";
import AdCard from "@/components/AdCard"; // ✅ IMPORT
import axios from "axios";

interface Chapter {
  id: number;
  number: number;
  title: string;
  imageUrls?: string[];
}

interface Manga {
  id: number;
  title: string;
  description: string;
  rating: number;
  status: "Ongoing" | "Completed";
  author: string;
  year: number;
  chapters: Chapter[];
  genres: string[];
  cover: string;
  chaptersCount?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function MangaDetailClient({ id }: { id: string }) {
  const [manga, setManga] = useState<Manga | null>(null);
  const [readerOpen, setReaderOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`${API_BASE_URL}/api/manga/${id}`)
      .then(res => setManga(res.data))
      .catch(err => console.error("Failed to fetch manga:", err));
  }, [id]);

  const openChapter = (chapter: Chapter) => {
    if (!chapter.imageUrls || chapter.imageUrls.length === 0) {
      alert("Chapter images not available.");
      return;
    }
    setSelectedImages(chapter.imageUrls);
    setReaderOpen(true);
  };

  if (!manga) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <BookOpen className="h-16 w-16 text-muted-foreground" />
          <p className="text-muted-foreground">Loading manga...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="relative h-64 md:h-80 overflow-hidden">
        {manga.cover && <img src={manga.cover} alt="" className="h-full w-full object-cover opacity-15 blur-2xl scale-125" />}
        <div className="absolute inset-0" style={{ background: "var(--gradient-dark)" }} />
      </div>

      <main className="container mx-auto px-4 -mt-32 relative z-10 pb-16">

        <Link href="/home" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to catalog
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT: COVER */}
          <div className="flex-shrink-0">
            <img
              src={manga.cover || "/placeholder.svg"}
              alt={manga.title}
              className="w-56 md:w-64 rounded-xl shadow-card border border-border/50"
            />
          </div>

          {/* CENTER: CONTENT */}
          <div className="flex-1 max-w-2xl space-y-5">
            <h1 className="text-3xl font-bold">{manga.title}</h1>

            <div className="flex gap-4 text-sm text-muted-foreground">
              <span><User className="inline w-4" /> {manga.author}</span>
              <span><Calendar className="inline w-4" /> {manga.year}</span>
            </div>

            <div className="flex gap-4">
              <span>⭐ {manga.rating}</span>
              <span>{manga.chapters.length} Chapters</span>
            </div>

            <p>{manga.description}</p>

            <p className="text-sm text-muted-foreground">
              Read {manga.title} manga online. Genres: {manga.genres.join(", ")}.
            </p>

            <button
              onClick={() => openChapter(manga.chapters[0])}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg"
            >
              Read Now
            </button>
          </div>

          {/* RIGHT: AD (YOUR RED BOX AREA) */}
          <div className="w-full lg:w-[750px] flex-shrink-0 flex items-start pt-16">
            <AdCard />
          </div>

        </div>

        {/* ✅ AD 2 */}
        <div className="mt-10">
          <AdCard />
        </div>

        {/* CHAPTERS */}
        <section className="mt-12 space-y-4">
          <h2 className="text-xl font-bold">Chapters</h2>

          {manga.chapters.map((ch) => (
            <button key={ch.id} onClick={() => openChapter(ch)} className="block w-full text-left p-3 border rounded">
              {ch.number}: {ch.title}
            </button>
          ))}
        </section>

        {/* ✅ AD 3 */}
        <div className="mt-12">
          <AdCard />
        </div>

      </main>

      {readerOpen && selectedImages && (
        <ImageReader images={selectedImages} title={manga.title} onClose={() => setReaderOpen(false)} />
      )}
    </div>
  );
}