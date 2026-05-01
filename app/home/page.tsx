

import { useState, useEffect } from "react";
import axios from "axios";
import {
  BookOpen,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import MangaCard from "@/components/MangaCard";
import SearchBar from "@/components/SearchBar";
import GenreFilter from "@/components/GenreFilter";
import FeaturedManga from "@/components/FeaturedManga";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const PAGE_SIZE = 10;

const AD_PLACEHOLDER = {
  id: "ad",
  title: "Sponsored",
  cover: "",
  genres: [],
  rating: 0,
  chaptersCount: 0,
  chapters: [],
};

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [mangaList, setMangaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allGenres, setAllGenres] = useState<string[]>(["All"]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(0);
  }, [selectedGenre]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/genres`)
      .then((res) => {
        const names = res.data.map((g: any) =>
          typeof g === "string" ? g : g.name
        );
        setAllGenres(["All", ...names]);
      })
      .catch((err) => console.error("Failed to fetch genres:", err));
  }, []);

  useEffect(() => {
    setLoading(true);

    const params: Record<string, any> = { page, size: PAGE_SIZE };
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (selectedGenre !== "All") params.genre = selectedGenre;

    axios
      .get(`${API_BASE_URL}/api/manga`, { params })
      .then((res) => {
        const { content, totalPages, totalElements } = res.data;
        setMangaList(content);
        setTotalPages(totalPages);
        setTotalElements(totalElements);
      })
      .catch((err) => console.error("Failed to fetch manga:", err))
      .finally(() => setLoading(false));
  }, [debouncedSearch, selectedGenre, page]);

  const featured =
    page === 0 &&
      !debouncedSearch &&
      selectedGenre === "All" &&
      mangaList.length > 0
      ? mangaList[0]
      : null;

  // ✅ Inject ads after every 5 cards
  const getListWithAds = () => {
    const result: any[] = [];

    mangaList.forEach((manga, index) => {
      result.push({ type: "manga", data: manga });

      if ((index + 1) % 5 === 0) {
        result.push({
          type: "ad",
          id: `ad-${index}`,
          data: AD_PLACEHOLDER,
        });
      }
    });

    return result;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* HEADER */}
        <section className="text-center space-y-4 py-6">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Read Manga Online Free -{" "}
            <span className="text-gradient-orange">MangaVerse</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            MangaVerse lets you read manga online for free. Discover popular
            manga and explore thousands of chapters.
          </p>
        </section>

        {/* SEARCH */}
        <section className="space-y-4">
          <div className="flex justify-center">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <GenreFilter
            selected={selectedGenre}
            onChange={setSelectedGenre}
            options={allGenres}
          />
        </section>

        {/* FEATURED */}
        {featured && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Featured</h2>
            </div>
            <FeaturedManga manga={featured} />
          </section>
        )}

        {/* LIST */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Popular Manga</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {totalElements} titles
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-xl bg-secondary animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {getListWithAds().map((item, index) => {
                if (item.type === "ad") {
                  return (
                    <div
                      key={item.id}
                      className="aspect-[3/4] rounded-xl border border-border bg-gradient-to-br from-orange-500/10 to-pink-500/10 flex items-center justify-center text-sm text-muted-foreground font-medium"
                    >
                      Sponsored Ad
                    </div>
                  );
                }

                return (
                  <MangaCard
                    key={item.data.id}
                    manga={{
                      ...item.data,
                      genres: item.data.genres || [],
                      chaptersCount: item.data.chaptersCount ?? 0,
                      chapters: item.data.chapters || [],
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>

              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={page >= totalPages - 1}
                className="flex items-center gap-1 px-4 py-2 rounded-lg border"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}